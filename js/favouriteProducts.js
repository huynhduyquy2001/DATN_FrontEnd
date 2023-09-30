
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
});