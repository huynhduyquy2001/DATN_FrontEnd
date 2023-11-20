app.controller('OrdersController', function ($scope, $http, $window) {
    var Url = "http://localhost:8080";
    var orderUrl = "http://localhost:8080/myOrders";
    var orders = {};
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

                                if (!grouped[key]) {
                                    grouped[key] = [];
                                }

                                grouped[key].push(order);
                            }
                        });

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
                            title: 'Nhận hàng thành công.'
                        })
                        $('#giao-hang').tab('show');
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

                                if (!grouped[key]) {
                                    grouped[key] = [];
                                }

                                grouped[key].push(order);
                            }
                        });

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
});