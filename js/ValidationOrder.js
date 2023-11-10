app.controller('ValidationOrderController', function ($scope, $http, $translate, $rootScope, $location) {
	//var Url = "https://viesonetapi2.azurewebsites.net";
	if (!$location.path().startsWith('/profile/')) {
		// Tạo phần tử link stylesheet
		var styleLink = document.createElement('link');
		styleLink.rel = 'stylesheet';
		styleLink.href = '/css/style.css';

		// Thêm phần tử link vào thẻ <head>
		document.head.appendChild(styleLink);
	}
	var Url = "https://viesonetapi2.azurewebsites.net/pending-confirmation";
	var Url2 = "https://viesonetapi2.azurewebsites.net/approveorders/";
	var orderwaitforconfirmation = {};
	$http.get(Url)
		.then(function (response) {
			orderwaitforconfirmation = response.data;
			$scope.orderwaitforconfirmation = orderwaitforconfirmation;
			console.log("Load dữ liệu" + orderwaitforconfirmation);
		})
		.catch(function (error) {
			console.error("Lỗi: " + error.data);
		});
	$scope.getOrders = function (orderID) {
		$http.post(Url2 + orderID)
			.then(function (resp) {
				$http.get(Url)
					.then(function (response) {
						orderwaitforconfirmation = response.data;
						$scope.orderwaitforconfirmation = orderwaitforconfirmation;
						console.log("Load dữ liệu" + orderwaitforconfirmation);
					})
			}).catch(function (error) {
				console.error("Lỗi: " + error.data);
			});
	}

});