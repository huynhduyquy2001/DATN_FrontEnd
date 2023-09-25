
app.controller('ProductDetailsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    //sản phẩm
    $scope.product = {};
    $scope.quantity = 0;
    $scope.total = -1;
    $scope.color = "";
    $scope.myRate = {};
    //Tăng giảm số lượng
    $scope.reduceQuantity = function () {
        if ($scope.quantity > 0) {
            $scope.quantity--;
        }

    }
    $scope.increaseQuantity = function () {
        if ($scope.total === "Hết hàng" || $scope.total === -1) {
            return;
        }
        $scope.quantity++;
    }

    //lấy số lượng tồn kho
    $scope.getTotal = function (id) {
        var color = $scope.product.productColors.find(function (obj) {
            if (obj.color.colorId === id) {
                $scope.total = obj.quantity;
                $scope.color = obj.color.colorName;
                $scope.quantity = 0;
            }
            if ($scope.total === 0) {
                $scope.total = "Hết hàng";
            }
            return 0; // Trả về 0 nếu không tìm thấy phần tử thỏa mãn điều kiện
        });
    };

    $http.get(Url + "/get-product/" + $routeParams.productId)
        .then(function (response) {
            $scope.product = response.data;
            $scope.myRate = $scope.product.ratings.find(function (obj) {
                if (obj.user.userId === $rootScope.myAccount.user.userId) {
                    return obj;
                }
            });
        });


    // lấy giá khuyến mãi
    $scope.getSalePrice = function (originalPrice, promotion) {
        if (promotion === 0) {
            return originalPrice;
        } else {
            //tính tổng số lượng các đánh giá 
            var SalePrice = originalPrice - (originalPrice * promotion / 100);
            return SalePrice;
        }
    }
    //Thêm sản phẩm vào giỏ hàng
    $rootScope.addShoppingCart = function (productId) {
        if ($scope.color === "" || $scope.quantity === 0) {
            return;
        }
        var formData = new FormData();
        formData.append("productId", productId);
        formData.append("quantity", $scope.quantity);
        formData.append("color", $scope.color);

        $http.post(Url + "/add-to-cart", formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
            .then(function (res) {

            })
            .catch(function (error) {
                // Xử lý lỗi ở đây
                console.log("Lỗi xảy ra: ", error);
            });
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: 'Thêm thành công vào giỏ hàng'
        })
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
    //định dạng thời gian
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

});