app.controller('ProductsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var url = "http://localhost:8080";

    $scope.product = {};
    $scope.colors = [];
    $scope.selectedColors = [];
    $scope.selectedProductColors = [];

    $scope.addProduct = function (userId) {
        // Lấy tất cả các đối tượng input bằng class
        var inputElements = document.querySelectorAll('.QuantityColor');

        // Khai báo một mảng để lưu trữ giá trị từ các input
        var quantities = [];

        // Lặp qua từng input và lấy giá trị của chúng
        inputElements.forEach(function (inputElement) {
            quantities.push(inputElement.value);
        });
        $http.post(url + '/products/add', $scope.product)
            .then(function (response) {
                // Xử lý kết quả sau khi thêm sản phẩm

                console.log('Sản phẩm đã được thêm thành công.');
            })
            .catch(function (error) {
                // Xử lý lỗi (nếu có)
                console.log(error);
            });

    };

    // Hàm để lấy danh sách màu sắc từ server

    $http.get(url + '/products/color')
        .then(function (response) {
            // Dữ liệu trả về từ API sẽ nằm trong response.data
            $scope.colors = response.data;
            console.log($scope.colors)
        })
        .catch(function (error) {
            console.log(error);
        });


    //Load màu lên
    $scope.logSelectedColors = function () {
        // Lấy tất cả các phần tử input có type là checkbox
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        // Lưu giá trị từ các checkbox
        var selectedColors = [];
        // Duyệt qua từng checkbox và kiểm tra xem nó có được chọn và hiển thị không
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked && checkbox.offsetParent !== null) {
                var color = checkbox.id.split('_');
                var id = color[0];
                var colorName = color[1];
                selectedColors.push({ colorId: id, colorName: colorName });
            }
        });
        console.log(selectedColors);
        $scope.selectedColors = selectedColors;
    };





});