app.controller('MyStoreController', function ($scope, $http, $routeParams, $rootScope) {
    var url = "http://localhost:8080";
    $scope.listProductMyStore = [];
    $scope.listProductPending = [];
    $scope.totalPages = 0;
    $scope.totalPagePending = 0;

	//Biến check xem có phải cửa hàng của mình không
	$scope.userId = $routeParams.userId;
	//Biến lưu trạng thái lọc 
	$scope.filterStatus = "Tất cả";

    // Hàm để thay đổi trạng thái lọc
    $scope.changeFilterStatus = function (status) {
        $scope.filterStatus = status;
    };

	$scope.customFilter = function (filter) {
		if ($scope.filterStatus === "Tất cả") {
			return true; // Hiển thị tất cả
		} else if ($scope.filterStatus === "Giá  dưới 200.000₫" && filter.originalPrice <= 200000) {
			return true; // Hiển thị đánh giá tích cực
		} else if ($scope.filterStatus === "Giá từ 200.000₫ đến 500.000₫" && filter.originalPrice > 200000 && filter.originalPrice <= 500000) {
			return true; // Hiển thị đánh giá tích cực
		} else if ($scope.filterStatus === "Giá từ 500.000₫ đến 1.000.000₫" && filter.originalPrice > 500000 && filter.originalPrice <= 1000000) {
			return true; // Hiển thị đánh giá tích cực
		} else if ($scope.filterStatus === "Trên 1.000.000₫" && filter.originalPrice > 1000000) {
			return true; // Hiển thị đánh giá tích cực
		} 
		return false; // Ẩn các sản phẩm không phù hợp với bất kỳ điều kiện nào
	};

	//Load sản phẩm theo số trang
    $scope.page = function(currentPageMyStore){
		
        $http.get(url + "/mystore/"+ $routeParams.userId + "/" + currentPageMyStore)
        .then(function (res) {
			 originalList = res.data.content;
             $scope.listProductMyStore = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
			 $scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
			 $rootScope.checkMystore = 1;
        })
        .catch(function (error) {
            console.log(error);
        });
    }

	//Load từ đầu
	$http.get(url + "/mystore/"+ $routeParams.userId + "/" + $scope.currentPageMyStore)
        .then(function (res) {
			 originalList = res.data.content;
             $scope.listProductMyStore = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
			 $scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
        })
        .catch(function (error) {
            console.log(error);
        });

    $scope.pagePending = function(currentPagePending){
		
        $http.get(url + "/mystore-pending/"+ $routeParams.userId + "/" + currentPagePending)
        .then(function (res) {
             $scope.listProductPending = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
			 $scope.totalPagePending = res.data.totalPages; // Lấy tổng số trang từ phản hồi
			 $rootScope.checkMystore = 2;
			})
        .catch(function (error) {
            console.log(error);
        });
    }

	//Tìm kiếm
	$scope.searchProduct = function(){
		var search = $scope.searchValue;
			if ($scope.searchValue === '') {
				$scope.listProductMyStore = originalList;
				return;
			}else{
				$http.get(url + "/searchProductMyStore/" + $routeParams.userId + "/" + search)
				.then(function(response) {
					$scope.listProductMyStore = response.data.content;
					$scope.totalPages = response.data.totalPages;
				});
			}
	}


	//Xóa sản phẩm 
	$scope.hideProductMyStore = function(productId){
		Swal.fire({
			text: 'Bạn có chắn muốn xóa sản phẩm này không?',
			icon: 'warning',
			confirmButtonText: 'Có, chắc chắn',
			showCancelButton: true,
			confirmButtonColor: '#159b59',
			cancelButtonColor: '#d33'
		  }).then((result) => {
			if (result.isConfirmed) {
				$http.post(url + "/hideProductMyStore/"+ $routeParams.userId + "/" + productId + "/" + $rootScope.currentPageMyStore)
				.then(function(response) {
					$scope.listProductMyStore = response.data.content;
					$scope.totalPages = response.data.totalPages;
				});
			}
		  })
	}

	//Phân trang đang bán
    $scope.Previous = function () {
		if ($rootScope.currentPageMyStore === 0) {
			return;
		} else {
			$rootScope.currentPageMyStore = $rootScope.currentPageMyStore - 1; // Cập nhật trang hiện tại
			$scope.page($rootScope.currentPageMyStore);

		}
	}

	$scope.Next = function () {
		if ($rootScope.currentPageMyStore === $scope.totalPages - 1) {
			return;
		} else {
			$rootScope.currentPageMyStore = $rootScope.currentPageMyStore + 1; // Cập nhật trang hiện tại

			$scope.page($rootScope.currentPageMyStore);
		}
	}

	//Phân trang của tabs chờ duyệt
    $scope.PreviousPending = function () {
		if ($rootScope.currentPagePending === 0) {
			return;
		} else {
			$rootScope.currentPagePending = $rootScope.currentPagePending - 1; // Cập nhật trang hiện tại
			$scope.pagePending($rootScope.currentPagePending);

		}
	}

	$scope.NextPending = function () {
		if ($rootScope.currentPagePending=== $scope.totalPagePending - 1) {
			return;
		} else {
			$rootScope.currentPagePending = $rootScope.currentPagePending + 1; // Cập nhật trang hiện tại

			$scope.pagePending($rootScope.currentPagePending);
		}
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
});