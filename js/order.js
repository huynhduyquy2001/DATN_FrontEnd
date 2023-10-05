app.controller('OrdersController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    var orderUrl = "http://localhost:8080/myOrders";
    var orders = {};
    $http.get(orderUrl)
        .then(function (response) {
            // Dữ liệu trả về từ API sẽ nằm trong response.data
            orders = response.data;
            $scope.orders = orders;
        })
        .catch(function (error) {
            console.log(error);
        });

    $scope.groupOrders = function (orders) {
        var grouped = {};
        angular.forEach(orders, function (order) { // Thay đổi tên biến ở đây
            if (order && order[3] && order[3].userId) { // Kiểm tra cấu trúc của order
                var userId = order[3].userId;
                if (!grouped[userId]) {
                    grouped[userId] = [];
                }
                grouped[userId].push(order);
            }
        });
        return grouped;
    };
});