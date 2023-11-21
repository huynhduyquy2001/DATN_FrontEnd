app.controller('OrdersController', function ($scope, $http, $window, $rootScope) {
    var Url = "http://localhost:8080";
    var orderUrl = "http://localhost:8080/myOrders";
    var orders = {};

    $scope.currentOrderPage = function (number) {
        $rootScope.checkOrderPage = number;
        $http.get(orderUrl)
            .then(function (response) {
                // Dữ liệu trả về từ API sẽ nằm trong response.data
                var grouped = [];

                angular.forEach(response.data, function (order) {
                    if (order && order[0] && order[0].orderDate && order[3] && order[3].userId && order[0].orderStatus.statusId) {
                        var userId = order[3].userId;
                        var orderDate = order[0].orderDate;
                        var statusId = order[0].orderStatus.statusId;
                        var key = userId + '-' + orderDate + '-' + statusId;

                        // Tìm vị trí để chèn mới vào mảng
                        var insertIndex = 0;
                        while (insertIndex < grouped.length && new Date(orderDate) < new Date(grouped[insertIndex][0].orderDate)) {
                            insertIndex++;
                        }

                        // Chèn mới vào mảng tại vị trí đã tìm được
                        grouped.splice(insertIndex, 0, [order]);
                    }
                });


                $scope.orders = grouped;
                console.log($scope.orders)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    $scope.acceptOrders = function (orderID) {
        $http.post(Url + "/acceptOrders/" + orderID)
            .then(function (response) {
                $http.get(orderUrl)
                    .then(function (response) {
                        // Dữ liệu trả về từ API sẽ nằm trong response.data
                        console.log(response)
                        var grouped = {};

                        angular.forEach(response.data, function (order) {
                            if (order && order[0] && order[0].orderDate && order[3] && order[3].userId && order[0].orderStatus.statusId) {
                                var userId = order[3].userId;
                                var orderDate = order[0].orderDate;
                                var statusId = order[0].orderStatus.statusId;
                                var key = userId + '-' + orderDate + '-' + statusId;

                                // Tìm vị trí để chèn mới vào mảng
                                var insertIndex = 0;
                                while (insertIndex < grouped.length && new Date(orderDate) < new Date(grouped[insertIndex][0].orderDate)) {
                                    insertIndex++;
                                }

                                // Chèn mới vào mảng tại vị trí đã tìm được
                                grouped.splice(insertIndex, 0, [order]);
                            }
                        });

                        $scope.orders = grouped;


                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }).catch(function (error) {
                console.error("Lỗi: " + error.data);
            });
    }

    $scope.cancelOrders = function (orderID) {
        $http.post(Url + "/cancelOrders/" + orderID)
            .then(function (response) {
                $http.get(orderUrl)
                    .then(function (response) {
                        // Dữ liệu trả về từ API sẽ nằm trong response.data
                        console.log(response)
                        var grouped = {};

                        angular.forEach(response.data, function (order) {
                            if (order && order[0] && order[0].orderDate && order[3] && order[3].userId && order[0].orderStatus.statusId) {
                                var userId = order[3].userId;
                                var orderDate = order[0].orderDate;
                                var statusId = order[0].orderStatus.statusId;
                                var key = userId + '-' + orderDate + '-' + statusId;

                                // Tìm vị trí để chèn mới vào mảng
                                var insertIndex = 0;
                                while (insertIndex < grouped.length && new Date(orderDate) < new Date(grouped[insertIndex][0].orderDate)) {
                                    insertIndex++;
                                }

                                // Chèn mới vào mảng tại vị trí đã tìm được
                                grouped.splice(insertIndex, 0, [order]);
                            }
                        });

                        $scope.orders = grouped;

                        $scope.orders = grouped;

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
                            title: 'Hủy đơn thành công.'
                        })
                        $('#huy-hang').tab('show');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }).catch(function (error) {
                console.error("Lỗi: " + error.data);
            });
    }

    if ($rootScope.checkOrderPage === 1) {
        $scope.currentOrderPage(1);
    } else if ($rootScope.checkOrderPage === 2) {
        $scope.currentOrderPage(2);
    } else if ($rootScope.checkOrderPage === 3) {
        $scope.currentOrderPage(3);
    } else if ($rootScope.checkOrderPage === 4) {
        $scope.currentOrderPage(4);
    } else if ($rootScope.checkOrderPage === 5) {
        $scope.currentOrderPage(5);
    } else if ($rootScope.checkOrderPage === 6) {
        $scope.currentOrderPage(6);
    }

});