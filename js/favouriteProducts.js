
app.controller('FavouriteProductsController', function ($scope, $http, $translate, $rootScope, $location) {
	var Url = "http://localhost:8080";

	$scope.favoriteProducts = [];
	$http.get(Url + "/get-favoriteProducts") // Sử dụng biến URL
		.then(function (response) {
			$scope.favoriteProducts = response.data;
		})
		.catch(function (error) {
			console.error("Lỗi: " + error.data);
		});

	$scope.getProduct = function (productId) {
		$http.get(Url + "/get-product/" + productId)
			.then(function (res) {
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

		$http.post(url + "/add-to-cart", formData, {
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
				$http.get(Url + "/get-favoriteProducts") // Sử dụng biến URL
					.then(function (response) {
						$scope.favoriteProducts = response.data;
					})
					.catch(function (error) {
						console.error("Lỗi: " + error.data);
					});
			});
	}
});