
app.controller('ShoppingController', function ($scope, $http, $translate, $rootScope, $location, $anchorScroll) {
	var url = "http://localhost:8080";
	$scope.productList = [];

	$scope.totalPages = 0;
	$scope.totalPagesTrending = 0;
	$scope.product = {};
	$scope.quantity = 1;
	$scope.total = -1;
	$scope.color = "";
	$scope.getproductList = function (currentPage) {
		$http.get(url + "/get-shopping-by-page/" + currentPage)
			.then(function (res) {
				$scope.productList = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
				$scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
				$rootScope.checkShopping = false;
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	$scope.getProduct = function (productId) {
		$http.get(url + "/get-product/" + productId)
			.then(function (res) {
				$scope.color = "";
				$scope.product = res.data;
				$scope.total = -1;
				$scope.quantity = 1;
			})
			.catch(function (error) {
				console.log(error);
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

	//----------------------------------------------------------------------------------

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
			return 0;
		});
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

		$http.post(url + "/add-to-cart", formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		})
			.then(function (res) {
				// Xử lý phản hồi từ máy chủ
			});
	}


	// -----------------------------------------------------------------------------------

	$scope.getproductListTrending = function (currentPage) {
		$http.get(url + "/get-trending/" + currentPage)
			.then(function (res) {
				$scope.productList = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
				$scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
				$rootScope.checkShopping = true;
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	$scope.PreviousTrending = function () {
		if ($rootScope.currentPageTrending === 0) {
			return;
		} else {
			$anchorScroll();
			$rootScope.currentPageTrending = $rootScope.currentPageTrending - 1; // Cập nhật trang hiện tại
			$scope.getproductList($rootScope.currentPageTrending);

		}
	}

	$scope.NextTrending = function () {
		if ($rootScope.currentPageTrending === $rootScope.currentPageTrending - 1) {
			return;
		} else {
			$anchorScroll();
			$rootScope.currentPageTrending = $rootScope.currentPageTrending + 1; // Cập nhật trang hiện tại
			$scope.getproductList($rootScope.currentPageTrending);
		}
	}
	if ($rootScope.checkShopping) {
		$scope.getproductListTrending($rootScope.currentPageTrending);
	} else {
		$scope.getproductList($rootScope.currentPage);
	}


	$scope.getFormattedTimeAgo = function (date) {
		var currentTime = new Date();
		var activityTime = new Date(date);
		var timeDiff = currentTime.getTime() - activityTime.getTime();
		var seconds = Math.floor(timeDiff / 1000);
		var minutes = Math.floor(timeDiff / (1000 * 60));
		var hours = Math.floor(timeDiff / (1000 * 60 * 60));
		var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

		if (days === 0) {
			if (hours === 0 && minutes < 60) {
				if (seconds < 60) {
					return 'vài giây trước';
				} else {
					return minutes + ' phút trước';
				}
			} else if (hours < 24) {
				return hours + ' giờ trước';
			}
		} else if (days === 1) {
			return 'Hôm qua';
		} else if (days <= 7) {
			return days + ' ngày trước';
		} else {
			// Hiển thị ngày, tháng và năm của activityTime
			var formattedDate = activityTime.getDate();
			var formattedMonth = activityTime.getMonth() + 1; // Tháng trong JavaScript đếm từ 0, nên cần cộng thêm 1
			var formattedYear = activityTime.getFullYear();
			return formattedDate + '-' + formattedMonth + '-' + formattedYear;
		}
	};
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
	//tính giá khuyến mãi
	$scope.getSalePrice = function (originalPrice, promotion) {
		if (promotion === 0) {
			return originalPrice;
		} else {
			//tính tổng số lượng các đánh giá
			var SalePrice = originalPrice - (originalPrice * promotion / 100);
			return SalePrice;
		}
	}

});