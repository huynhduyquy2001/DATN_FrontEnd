
app.controller('FavouriteProductsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams, $anchorScroll) {
	var Url = "http://localhost:8080";
	$scope.totalPagesF = 0;
	$scope.favoriteProducts = [];

	$scope.spiuthich = function (currentPage) {
		$http.get(Url + "/get-favoriteProducts/" + currentPage) // Sử dụng biến Url
			.then(function (res) {
				$scope.favoriteProducts = res.data.content;
				$scope.totalPagesF = res.data.totalPages;
			})
			.catch(function (error) {
				console.error("Lỗi: " + error);
			});
	}
	$scope.spiuthich($rootScope.currentPage);
	$scope.getProduct = function (productId) {
		$http.get(Url + "/get-product/" + productId)
			.then(function (res) {
				$scope.product = res.data; // Lưu danh sách sản phẩm từ phản hồi
				$scope.totalPagesF = res.data.totalPages; // Lấy tổng số trang từ phản hồi
				$scope.product = res.data;
				$scope.total = -1;
				$scope.quantity = 1;
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	//tính lượt đánh giá trung bình
	$scope.calculateAverageRating = function (ratings) {
		if (ratings.length === 0) {
			return 0;
		} else {
			//tính tổng số lượng các đánh giá
			var totalRatings = ratings.reduce(function (sum, rating) {
				return sum + parseFloat(rating.ratingValue);
			}, 0);

			var averageRating = totalRatings / ratings.length;
			return averageRating.toFixed(1);
		}
	}
	//tính giá khuyếb mãi
	$scope.getSalePrice = function (originalPrice, promotion) {
		if (promotion === 0) {
			return originalPrice;
		} else {
			//tính tổng số lượng các đánh giá
			var SalePrice = originalPrice - (originalPrice * promotion / 100);
			return SalePrice;
		}
	}
	//-----------------------------------------------------------------------------------

	//Tăng giảm số lượng
	$scope.reduceQuantity = function () {
		if ($scope.quantity > 0) {
			$scope.quantity--;
		}

	}
	$scope.increaseQuantity = function () {
		$scope.quantity++;
	}
	//lấy số lượng tồn kho
	$scope.getTotal = function (id) {
		var color = $scope.product.productColors.find(function (obj) {
			if (obj.color.colorId === id) {
				$scope.total = obj.quantity;
				$scope.color = obj.color.colorName;
			}
			return 0; // Trả về 0 nếu không tìm thấy phần tử thỏa mãn điều kiện
		});
	};

	$rootScope.addShoppingCart = function (productId) {
		var formData = new FormData();
		formData.append("productId", productId);
		formData.append("quantity", $scope.quantity);
		formData.append("color", $scope.color);

		$http.post(Url + "/add-to-cart", formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		})
			.then(function (res) {
				alert("ok")
			});
	}
	$scope.togglerFavorite = function (productId) {
		$http.post(Url + "/addfavoriteproduct/" + productId)
			.then(function (response) {
				$scope.favorite = !$scope.favorite;
				$http.get(Url + "/get-favoriteProducts") // Sử dụng biến Url
					.then(function (response) {
						$scope.favoriteProducts = response.data;
					})
					.catch(function (error) {
						console.error("Lỗi: " + error.data);
					});
			});
	}

	$scope.Previous = function () {
		if ($rootScope.currentPage === 0) {
			return;
		} else {
			$anchorScroll();
			$rootScope.currentPage = $rootScope.currentPage - 1; // Cập nhật trang hiện tại
			$scope.spiuthich($rootScope.currentPage);

		}
	}

	$scope.Next = function () {
		if ($rootScope.currentPage === $scope.totalPagesF - 1) {
			return;
		} else {
			$anchorScroll();
			$rootScope.currentPage = $rootScope.currentPage + 1; // Cập nhật trang hiện tại
			$scope.spiuthich($rootScope.currentPage);
		}
	}

	$scope.chooseKey = function (word) {
		$scope.productNameF = word;
		$scope.findProductNoSplitText(0);
	}
	//Tìm kiếm 
	// Khởi tạo biến $scope.words là một mảng để lưu trữ các từ
	$scope.words = [];

	// Hàm để tách chuỗi thành danh từ, tính từ và động từ
	$scope.splitText = function (sentence) {
		var words = sentence.split(/[ ,.]+/); // Tách chuỗi thành các từ

		// Xóa nội dung cũ của $scope.words
		$scope.words.length = 0;

		// Lặp qua từng từ để xác định loại (danh từ, tính từ hoặc động từ)
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			var nextWord = words[i + 1];

			if (word.match(/[a-zA-Z]/)) {
				// Kiểm tra nếu từ chứa chữ cái (tiếng Việt)
				if (nextWord) {
					var combinedWord = word + ' ' + nextWord;

					if (nextWord.endsWith("ng")) {
						$scope.words.push(combinedWord);
						i++; // Bỏ qua từ tiếp theo vì đã kết hợp thành động từ
					} else {
						$scope.words.push(word);
					}
				} else {
					$scope.words.push(word);
				}
			}
			// console.log($scope.words);
		}
	};

	$scope.findProductNoSplitText = function (currentPage) {

		$rootScope.currentPageSearchFavorite = currentPage;
		$rootScope.keyF = $scope.productNameF;
		// Sử dụng tham số truy vấn 'name' bằng cách thêm vào Url
		$http.get(Url + "/find-productFavorite-by-name/" + currentPage, {
			params: { keyF: $scope.productNameF }
		})
			.then(function (res) {
				$scope.favoriteProducts = res.data.content;
				$scope.totalPagesF = res.data.totalPages;
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.findProductF = function (currentPage) {
		$scope.splitText($scope.productNameF);

		$rootScope.currentPageSearchFavorite = currentPage;
		$rootScope.keyF = $scope.productNameF;
		// Sử dụng tham số truy vấn 'name' bằng cách thêm vào Url
		$http.get(Url + "/find-productFavorite-by-name/" + currentPage, {
			params: { keyF: $scope.productNameF }
		})
			.then(function (res) {
				$scope.favoriteProducts = res.data.content;
				$scope.totalPagesF = res.data.totalPages;
			})
			.catch(function (error) {
				console.log(error.data);
			});
	};

	const searchInputF = document.querySelector('#search-F');
	// Tro ly ao
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

	const recognition = new SpeechRecognition();
	const synth = window.speechSynthesis;
	recognition.lang = 'vi-VI';
	recognition.continuous = false;

	const microphone = document.querySelector('.microphone');

	const speak = (text) => {
		if (synth.speaking) {
			console.error('Busy. Speaking...');
			return;
		}

		const utter = new SpeechSynthesisUtterance(text);

		utter.onend = () => {
			console.log('SpeechSynthesisUtterance.onend');
		}
		utter.onerror = (err) => {
			console.error('SpeechSynthesisUtterance.onerror', err);
		}

		synth.speak(utter);
	};

	const handleVoice = (text) => {
		console.log('text', text);
		$scope.productNameF = text.toLowerCase();


		searchInputF.value = $scope.productNameF;

		// searchInputF.dispatchEvent(changeEvent);
		$rootScope.keyF = $scope.productNameF;
		$scope.findProductF(0);
		//searchInputF.dispatchEvent($scope.findProductF($scope.productNameF));
		return;


		speak('Try again');
	}

	microphone.addEventListener('click', (e) => {
		e.preventDefault();

		recognition.start();
		microphone.classList.add('recording');
	});

	recognition.onspeechend = () => {
		recognition.stop();
		microphone.classList.remove('recording');
	}

	recognition.onerror = (err) => {
		console.error(err);
		microphone.classList.remove('recording');
	}

	recognition.onresult = (e) => {
		console.log('onresult', e);
		const text = e.results[0][0].transcript;
		handleVoice(text);
	}
});