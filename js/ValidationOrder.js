app.controller('ValidationOrderController', function ($scope, $http, $translate, $rootScope, $location) {
	var Url = "http://localhost:8080/pending-confirmation";
	var Url2 = "http://localhost:8080/approveorders/";
	$scope.orders = [];
	$scope.sumPrice = 0;
	// Hiện những đơn hàng cần duyệt 
	$http.get(Url)
		.then(function (response) {
			// Dữ liệu trả về từ API sẽ nằm trong response.data
			console.log(response.data);
			var grouped = {};
			angular.forEach(response.data, function (order) {
				if (order && order[0] && order[0].orderDate && order[3] && order[3].userId && order[0].orderStatus.statusId) {
					var userId = order[3].userId;
					var orderDate = order[0].orderDate;
					var statusId = order[0].orderStatus.statusId;
					var key = userId + '-' + orderDate + '-' + statusId;
					if (!grouped[key]) {
						grouped[key] = [];
					}
					grouped[key].push(order);

				}
			});
			$scope.orders = grouped;
			console.log($scope.orders);
		})
		.catch(function (error) {
			console.log(error);
		});


	//Duyệt đơn hàng
	$scope.addapproveorders = function (orderID) {
		$http.post(Url2 + orderID)
			.then(function (resp) {
				$http.get(Url)
					.then(function (response) {
						// Dữ liệu trả về từ API sẽ nằm trong response.data
						console.log(response)
						alert(response.data.length)
						var grouped = {};
						angular.forEach(response.data, function (order) {
							if (order && order[0] && order[0].orderDate && order[3] && order[3].userId && order[0].orderStatus.statusId) {
								var userId = order[3].userId;
								var orderDate = order[0].orderDate;
								var statusId = order[0].orderStatus.statusId;
								var key = userId + '-' + orderDate + '-' + statusId;

								if (!grouped[key]) {
									grouped[key] = [];
								}

								grouped[key].push(order);
							}
						});
						$scope.orders = grouped;
						console.log($scope.orders);

					})
					.catch(function (error) {
						console.log(error);
					});
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