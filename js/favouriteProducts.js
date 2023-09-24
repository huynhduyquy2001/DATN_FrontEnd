
app.controller('FavouriteProductsController', function ($scope, $http, $translate, $rootScope, $location) {
	var Url = "http://localhost:8080";

	$scope.favoriteProducts = [];

	$http.get(Url + "/get-favoriteProducts") // Sử dụng biến URL
		.then(function (response) {
			$scope.favoriteProducts = response.data;
			console.log("LISTTHICSSANPHAM" + $scope.favoriteProducts)
		})
		.catch(function (error) {
			console.error("Lỗi: " + error.data);
		});
});