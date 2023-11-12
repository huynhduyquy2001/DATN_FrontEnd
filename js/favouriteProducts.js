
app.controller('FavouriteProductsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams, $anchorScroll) {
	var Url = "https://viesonetapi4.azurewebsites.net";
	$scope.totalPagesF = 0;
	$scope.favoriteProducts = [];
	var originalFavoriteProducts = [];
	$scope.color = "";


	$scope.spiuthich = function (currentPage) {
		$http.get(Url + "/get-favoriteProducts/" + currentPage) // Sử dụng biến Url
			.then(function (res) {
				originalFavoriteProducts = res.data.content;
				$scope.favoriteProducts = originalFavoriteProducts;
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

	// Tạo hàm tìm kiếm
	$scope.searchFavoriteProducts = function (searchTerm) {
		// Chia chuỗi tìm kiếm thành các từ riêng lẻ
		var searchTerms = searchTerm.toLowerCase().split(' ');

		// Khởi tạo danh sách kết quả
		var searchResults = [];

		// Duyệt qua từng từ trong danh sách từ tìm kiếm
		for (var i = 0; i < searchTerms.length; i++) {
			var term = searchTerms[i];
			var termResults = originalFavoriteProducts.filter(function (product) {
				return product.productName.toLowerCase().includes(term);
			});

			// Nếu danh sách kết quả rỗng, gán kết quả từ từng từ vào danh sách kết quả chung
			if (searchResults.length === 0) {
				searchResults = termResults;
			} else {
				// Nếu danh sách kết quả chung không rỗng, thực hiện giao của danh sách kết quả chung và danh sách từng từ
				searchResults = searchResults.filter(function (product) {
					return termResults.includes(product);
				});
			}
		}

		// Kiểm tra xem danh sách kết quả cuối cùng có trống không
		if (searchResults.length === 0) {
			// Xử lý trường hợp không tìm thấy sản phẩm, ví dụ, hiển thị thông báo cho người dùng
			$scope.searchnull = "Không tìm thấy sản phẩm phù hợp";
			$scope.isHidden = true;

		}
		else {
			$scope.searchnull = "";
		}


		// Gán kết quả tìm kiếm cho $scope.favoriteProducts
		$scope.favoriteProducts = searchResults;
	};

	// Biến lưu từ khóa tìm kiếm
	$scope.productNameF = "";

	// Hàm gọi khi người dùng thực hiện tìm kiếm
	$scope.performSearch = function () {
		$scope.searchFavoriteProducts($scope.productNameF);
	};




	$rootScope.addShoppingCart = function (productId) {
		if ($scope.color === "") {
			const Toast = Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true,
				didOpen: (toast) => {
					toast.addEventListener('mouseenter', Swal.stopTimer)
					toast.addEventListener('mouseleave', Swal.resumeTimer)
				}
			})

			Toast.fire({
				icon: 'warning',
				title: 'Hãy chọn màu sắc sản phẩm'
			})
			return;
		}
		if ($scope.quantity === 0) {
			const Toast = Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true,
				didOpen: (toast) => {
					toast.addEventListener('mouseenter', Swal.stopTimer)
					toast.addEventListener('mouseleave', Swal.resumeTimer)
				}
			})

			Toast.fire({
				icon: 'warning',
				title: 'Hãy chọn số lượng cần mua'
			})
			return;
		}

		var formData = new FormData();

		formData.append("productId", productId);
		formData.append("quantity", $scope.quantity);
		formData.append("color", $scope.color);

		$http.post(Url + "/add-to-cart", formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(function (res) {
			//Load thông tin giỏ hàng
			$http.get(Url + '/get-product-shoppingcart').then(function (response) {
				$rootScope.listProduct = response.data;
			}).catch(function (error) {
				console.error('Lỗi khi lấy dữ liệu:', error);
			});
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
		$scope.searchFavoriteProducts($scope.productNameF);
		//searchInputF.dispatchEvent($scope.findProductF($scope.productNameF));
		console.log("Nói ra nè " + $scope.productNameF);
		return;
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