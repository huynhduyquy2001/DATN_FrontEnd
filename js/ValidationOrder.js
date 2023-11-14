app.controller('ValidationOrderController', function ($scope, $http, $translate, $rootScope, $location) {
	var Url = "http://localhost:8080/pending-confirmation";
	var Url2 = "http://localhost:8080/approveorders/";
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
	$scope.addapproveorders = function (orderID) {
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
	function checkScreenWidth() {
		var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		var asideLeft = document.getElementById('asideLeft');
		var view = document.getElementById('view');
		if (screenWidth <= 1080) {
			asideLeft.style.left = '-280px';

			asideLeft.style.opacity = '0';
			view.classList.remove('col-lg-9', 'offset-lg-3');
			view.classList.add('col-lg-11', 'offset-lg-1');

		} else {
			if (view) {
				view.classList.remove('col-lg-11', 'offset-lg-1');
				view.classList.add('col-lg-9', 'offset-lg-3');
				asideLeft.style.opacity = '1';
				asideLeft.style.left = '0'; // Hoặc thay đổi thành 'block' nếu cần hiển thị lại
				$rootScope.checkMenuLeft = true;
				$scope.$apply(); // Kích hoạt digest cycle để cập nhật giao diện
			}



		}
	}
	setTimeout(function () {
		checkScreenWidth();
	}, 100);
});