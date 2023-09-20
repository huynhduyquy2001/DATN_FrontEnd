
app.controller('ProductDetailsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    $scope.product = {};
    $http.get(Url + "/get-product/" + $routeParams.productId)
        .then(function (response) {
            $scope.product = response.data;
        })

    $scope.getSalePrice = function (originalPrice, promotion) {
        if (promotion === 0) {
            return originalPrice;
        } else {
            //tính tổng số lượng các đánh giá
            var SalePrice = originalPrice * promotion / 100;
            return SalePrice;
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