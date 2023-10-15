app.controller('MyStoreController', function ($scope, $http, $translate, $rootScope, $location) {
    var url = "http://localhost:8080";
    $scope.listProductMyStore = [];
    $scope.totalPages = 0;

	//Biến lưu trạng thái lọc 
	$scope.filterStatus = "Tất cả";

    // Hàm để thay đổi trạng thái lọc
    $scope.changeFilterStatus = function (status) {
        $scope.filterStatus = status;
    };

	$scope.customFilter = function (filter) {
		if ($scope.filterStatus === "Tất cả") {
			return true; // Hiển thị tất cả
		} else if ($scope.filterStatus === "Đánh giá cao" && filter.ratings.ratingValue >= 3) {
			return true; // Hiển thị đánh giá tích cực
		} else if ($scope.filterStatus === "Đánh giá thấp" && filter.ratings.ratingValue < 3) {
			return true; // Hiển thị đánh giá tiêu cực
		} else if ($scope.filterStatus === "Bán nhiều nhất" && filter.soldQuantity === $scope.maxSoldQuantity) {
			return true; // Hiển thị sản phẩm có số lượng bán bằng với số lượng bán cao nhất
		} else if ($scope.filterStatus === "Bán ít nhất" && filter.soldQuantity === $scope.minSoldQuantity) {
			return true; // Hiển thị sản phẩm có số lượng bán bằng với số lượng bán thấp nhất
		}
		return false; // Ẩn các sản phẩm không phù hợp với bất kỳ điều kiện nào
	};

	// Hàm để cập nhật số lượng bán cao nhất và thấp nhất
	$scope.filter = function () {
		$scope.maxSoldQuantity = Math.max.apply(Math, $scope.listProductMyStore.map(function(product) { return product.soldQuantity; }));
		$scope.minSoldQuantity = Math.min.apply(Math, $scope.listProductMyStore.map(function(product) { return product.soldQuantity; }));
	};

	//Load sản phẩm theo số trang
    $scope.page = function(currentPageMyStore){
        $http.get(url + "/get-product-mystore/" + $rootScope.currentPageMyStore)
        .then(function (res) {
			console.log(res.data.content)
			 originalList = res.data.content;
             $scope.listProductMyStore = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
             $scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
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
				$http.get(url + "/searchProductMyStore/" + search)
				.then(function(response) {
					$scope.listProductMyStore = response.data.content;
					$scope.totalPages = res.data.totalPages;
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
				$http.post(url + "/hideProductMyStore/" + productId + "/" + $rootScope.currentPageMyStore)
				.then(function(response) {
					$scope.listProductMyStore = response.data.content;
					$scope.totalPages = response.data.totalPages;
				});
			}
		  })
	}


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

	//Load sản phẩm cửa hàng khi mới vào
	$scope.page();
});