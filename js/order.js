app.controller('OrdersController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    var orderUrl = "http://localhost:8080/myOrders";
    var orders = {};
    $http.get(orderUrl)
        .then(function (response) {
            // Dữ liệu trả về từ API sẽ nằm trong response.data
            orders = response.data;
            $scope.orders = orders;
            console.log(orders)
        })
        .catch(function (error) {
            console.log(error);
        });

});