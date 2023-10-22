
app.controller('FavouriteProductsController', function ($scope, $http, $translate, $rootScope, $location) {
	var Url = "http://localhost:8080";
	$scope.totalPages = 0;
	$scope.totalPagesTrending = 0;
	$scope.favoriteProducts = [];
	$http.get(Url + "/get-favoriteProducts") // Sử dụng biến Url
		.then(function (response) {
			$scope.favoriteProducts = response.data;
		})
		.catch(function (error) {
			console.error("Lỗi: " + error.data);
		});

	$scope.getProduct = function (productId) {
		$http.get(Url + "/get-product/" + productId)
			.then(function (res) {
				$scope.product = res.data; // Lưu danh sách sản phẩm từ phản hồi
				$scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
				// $scope.product = res.data;
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
				// Xử lý phản hồi từ máy chủ
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
			$scope.getproductList($rootScope.currentPage);

		}
	}

	$scope.Next = function () {
		if ($rootScope.currentPage === $scope.totalPages - 1) {
			return;
		} else {
			$anchorScroll();
			$rootScope.currentPage = $rootScope.currentPage + 1; // Cập nhật trang hiện tại

			$scope.getproductList($rootScope.currentPage);
		}
	}


	$http.get(Url + "/get-shopping-by-page/" + 1)
		.then(function (res) {
			$scope.productList = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
			$scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
			$rootScope.checkShopping = 2;
			console.log("Ra hay k ra", $scope.productList);
		})
		.catch(function (error) {
			console.log(error);
		});


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

	$scope.findProductNoSplitText = function (currentPageSearch) {

		$rootScope.currentPageSearch = currentPageSearch;
		$rootScope.key = $scope.productName;
		$rootScope.checkShopping = 3;
		// Sử dụng tham số truy vấn 'name' bằng cách thêm vào Url
		$http.get(Url + "/find-product-by-name/" + currentPageSearch, {
			params: { key: $scope.productName }
		})
			.then(function (res) {
				$scope.productList = res.data.content;
				$scope.totalPages = res.data.totalPages;
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.findProduct = function (currentPageSearch) {
		$scope.splitText($scope.productName);

		$rootScope.currentPageSearch = currentPageSearch;
		$rootScope.key = $scope.productName;
		$rootScope.checkShopping = 3;
		// Sử dụng tham số truy vấn 'name' bằng cách thêm vào Url
		$http.get(Url + "/find-product-by-name/" + currentPageSearch, {
			params: { key: $scope.productName }
		})
			.then(function (res) {
				$scope.productList = res.data.content;
				$scope.totalPages = res.data.totalPages;
			})
			.catch(function (error) {
				console.log(error);
			});
	};
});