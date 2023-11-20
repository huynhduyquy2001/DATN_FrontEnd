app.controller('ValidationOrderController', function ($scope, $http, $translate, $rootScope, $location) {
	var Url = "http://localhost:8080/pending-confirmation";
	var Url2 = "http://localhost:8080/approveorders/";
	$scope.sumPrice = 0;
	$scope.pageSize = 1; // Số lượng đơn hàng hiển thị mỗi lần
	$scope.currentPage = 0; // Trang hiện tại
	$scope.orders = {}; // Sử dụng object để lưu trữ các đơn hàng theo key

	$scope.OrderPendingApproval = function (check) {
		$rootScope.checkMyOrder = check;
		$scope.orders = {};
		$http.get(Url)
			.then(function (response) {
				console.log(response.data);
				var filteredOrders = response.data.filter(function (order) {
					return order[0] && order[0].orderDate && order[3] && order[3].userId && order[0].orderStatus.statusId && (order[0].orderStatus.statusId === check);
				});

				var totalItems = filteredOrders.length;
				var totalPages = Math.ceil(totalItems / $scope.pageSize);

				var start = $scope.currentPage * $scope.pageSize;
				var end = start + $scope.pageSize;
				var currentOrders = filteredOrders.slice(start, end);

				angular.forEach(currentOrders, function (order) {
					var userId = order[3].userId;
					var orderDate = order[0].orderDate;
					var statusId = order[0].orderStatus.statusId;
					var key = userId + '-' + orderDate + '-' + statusId + '-' + order[0].orderId; // Đảm bảo key là đủ duy nhất

					if (!$scope.orders[key]) {
						$scope.orders[key] = [];
					}
					$scope.orders[key].push(order);
				});

				console.log($scope.orders);

				$scope.hasMoreItems = $scope.currentPage < totalPages - 1;
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.OrderPendingApproval2 = function (check) {
		$rootScope.checkMyOrder = check;
		// $scope.orders = {};
		$http.get(Url)
			.then(function (response) {
				console.log(response.data);
				var filteredOrders = response.data.filter(function (order) {
					return order[0] && order[0].orderDate && order[3] && order[3].userId && order[0].orderStatus.statusId && (order[0].orderStatus.statusId === check);
				});

				var totalItems = filteredOrders.length;
				var totalPages = Math.ceil(totalItems / $scope.pageSize);

				var start = $scope.currentPage * $scope.pageSize;
				var end = start + $scope.pageSize;
				var currentOrders = filteredOrders.slice(start, end);

				angular.forEach(currentOrders, function (order) {
					var userId = order[3].userId;
					var orderDate = order[0].orderDate;
					var statusId = order[0].orderStatus.statusId;
					var key = userId + '-' + orderDate + '-' + statusId + '-' + order[0].orderId; // Đảm bảo key là đủ duy nhất

					if (!$scope.orders[key]) {
						$scope.orders[key] = [];
					}
					$scope.orders[key].push(order);
				});

				console.log($scope.orders);

				$scope.hasMoreItems = $scope.currentPage < totalPages - 1;
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.showMoreItems = function () {
		$scope.currentPage++;
		$scope.OrderPendingApproval2($rootScope.checkMyOrder);
		// Kiểm tra xem có đơn hàng nào khác không để ẩn/hiện nút
		var totalItems = Object.keys($scope.orders).length;
		var totalPages = Math.ceil(totalItems / $scope.pageSize);
		$scope.hasMoreItems = $scope.currentPage < totalPages - 1;
	};

	//Duyệt đơn hàng
	$scope.addapproveorders = function (orderID) {
		$http.post(Url2 + orderID)
			.then(function (resp) {
				$http.get(Url)
					.then(function (response) {
						console.log(response.data);
						var filteredOrders = response.data.filter(function (order) {
							return order[0] && order[0].orderDate && order[3] && order[3].userId && order[0].orderStatus.statusId && (order[0].orderStatus.statusId === check);
						});

						var totalItems = filteredOrders.length;
						var totalPages = Math.ceil(totalItems / $scope.pageSize);

						var start = $scope.currentPage * $scope.pageSize;
						var end = start + $scope.pageSize;
						var currentOrders = filteredOrders.slice(start, end);

						angular.forEach(currentOrders, function (order) {
							var userId = order[3].userId;
							var orderDate = order[0].orderDate;
							var statusId = order[0].orderStatus.statusId;
							var key = userId + '-' + orderDate + '-' + statusId + '-' + order[0].orderId; // Đảm bảo key là đủ duy nhất

							if (!$scope.orders[key]) {
								$scope.orders[key] = [];
							}
							$scope.orders[key].push(order);
						});

						console.log($scope.orders);

						$scope.hasMoreItems = $scope.currentPage < totalPages - 1;
					})
					.catch(function (error) {
						console.log(error);
					});
			}).catch(function (error) {
				console.error("Lỗi: " + error.data);
			});
	}

	$scope.xuatExcel = function () {
		var table2excel = new Table2Excel();
		table2excel.export(document.getElementById("bangtest"))
		// var elment = document.getElementById('donhang');
		// var opt = {
		// 	margin: 0.5,
		// 	filename: 'myfilepdf.pdf',
		// 	image: { type: 'jpeg', quality: 0.98 },
		// 	html2canvas: { scale: 2 },
		// 	jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
		// };
		// html2pdf(elment, opt);

	}
	if ($rootScope.checkMyOrder === 1) {
		$scope.OrderPendingApproval(1);
	} else
		$scope.OrderPendingApproval(2);


});