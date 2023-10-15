app.controller('ValidationOrderController ', function ($scope, $http, $translate, $rootScope, $location) {
	//var Url = "http://localhost:8080";
	if (!$location.path().startsWith('/profile/')) {
		// Tạo phần tử link stylesheet
		var styleLink = document.createElement('link');
		styleLink.rel = 'stylesheet';
		styleLink.href = '/css/style.css';

		// Thêm phần tử link vào thẻ <head>
		document.head.appendChild(styleLink);
	}
	var Url = "http://localhost:8080/pending-confirmation";

	$http.get(Url)
		.then(function (response) {
			$scope.orderwaitforconfirmation = response.data;
			console.log($scope.orderwaitforconfirmation);
		})
		.catch(function (error) {
			console.error("Lỗi: " + error.data);
		});
});