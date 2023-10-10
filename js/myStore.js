app.controller('MyStoreController', function ($scope, $http, $translate, $rootScope, $location) {
    var url = "http://localhost:8080";
    $scope.listProductMyStore = [];
    $scope.totalPages = 0;
    
	//Load sản phẩm theo số trang
    $scope.page = function(currentPageMyStore){
        $http.get(url + "/get-product-mystore/" + $rootScope.currentPageMyStore)
        .then(function (res) {
             $scope.listProductMyStore = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
             $scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
        })
        .catch(function (error) {
            console.log(error);
        });
    }

	//Lọc sản phẩm theo giá tăng dần
	$scope.sortByMinForMax = function(){
		$http.get(url + "/filter-product-mystore/" + $rootScope.currentPageFilter + "/")
        .then(function (res) {
             $scope.listProductMyStore = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
             $scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi
             console.log($scope.listProductMyStore)
        })
        .catch(function (error) {
            console.log(error);
        });
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