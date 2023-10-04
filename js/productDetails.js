
app.controller('ProductDetailsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    //sản phẩm
    $scope.product = {};
    $scope.quantity = 0;
    $scope.total = -1;
    $scope.color = "";
    $scope.myRate = {};
    $scope.myRatings = 0;
    $scope.AverageRating = 0;
    $scope.relatedProducts = [];
    $scope.favorite = false;

    //đánh giá sản phẩm
    $scope.rate = function () {

        if ($scope.myRate) {
            $scope.myRate.ratingValue = $scope.myRatings;
        } else {
            $scope.myRate = {
                "ratingId": null,
                "user": null,
                "ratingValue": $scope.myRatings,
                "ratingContent": $scope.myRate.ratingContent,
                "ratingDate": new Date()
            };
        }

        $http.post(Url + "/rate-product/" + $scope.product.productId, $scope.myRate, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            $scope.myRate = response.data;
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
                title: 'Đánh giá thành công'
            })
        })
            .catch(function (error) {
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
                    icon: 'warning',
                    title: 'Đánh giá không thành công'
                })
            });
    }

    $scope.addStars = function (index) {
        $scope.myRatings = $scope.myRatings + index + 1;
    };
    $scope.removeStars = function (index) {
        if (index !== 0) {
            index++;
        }
        $scope.myRatings = $scope.myRatings - ($scope.myRatings - index);
    };

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
    //lấy thông tin sản phẩm
    $http.get(Url + "/get-product/" + $routeParams.productId)
        .then(function (response) {
            $scope.product = response.data;
            if ($scope.product.ratings.length > 0) {
                //tính tổng số lượng các đánh giá

                var totalRatings = $scope.product.ratings.reduce(function (sum, rating) {
                    return sum + parseFloat(rating.ratingValue);
                }, 0);

                var averageRating = totalRatings / $scope.product.ratings.length;
                averageRating = averageRating.toFixed(1);
                $scope.AverageRating = averageRating;
                $http.get(Url + "/get-related-products/" + $scope.product.user.userId)
                    .then(function (response) {
                        $scope.relatedProducts = response.data;

                    });
                $http.get(Url + "/get-favorite-product/" + $scope.product.productId)
                    .then(function (response) {
                        $scope.favorite = response.data;
                    });
            }
            $scope.myRate = $scope.product.ratings.find(function (obj) {
                if (obj.user.userId === $rootScope.myAccount.user.userId) {
                    $scope.myRatings = obj.ratingValue;
                    return obj;
                }
            });

        });

    //tính lượt đánh giá trung bình


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

    $scope.togglerFavorite = function () {
        $http.post(Url + "/add-favorite-product/" + $routeParams.productId)
            .then(function (response) {
                $scope.favorite = !$scope.favorite;
            });
    }

});