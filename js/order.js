app.controller('OrdersController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    var orderUrl = "http://localhost:8080/myOrders";
    var orders = {};
    $http.get(orderUrl)
        .then(function (response) {
            // Dữ liệu trả về từ API sẽ nằm trong response.data
            console.log(response)
            var grouped = {};

            angular.forEach(response.data, function (order) {
                if (order && order[0] && order[0].orderDate && order[3] && order[3].userId) {
                    var userId = order[3].userId;
                    var orderDate = order[0].orderDate;
                    var key = userId + '-' + orderDate;

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
    $scope.showOrderDetailsModal = function () {

        // Logic để hiển thị modal đơn hàng

        $('#orderDetailsModal').modal('show');

    };

});