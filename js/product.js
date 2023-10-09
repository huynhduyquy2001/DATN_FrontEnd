app.controller('ProductsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    var isChecked = false;
    $scope.product = {};
    $scope.colors = [];
    $scope.selectedColors = [];

    $scope.addProduct = function (userId) {
        $http.post(Url + '/products/add', $scope.product)
            .then(function (response) {
                // Xử lý kết quả sau khi thêm sản phẩm
                $scope.product.userId = userId;
                console.log('Sản phẩm đã được thêm thành công.');
            })
            .catch(function (error) {
                // Xử lý lỗi (nếu có)
                console.log(error);
            });
    };

    // Hàm để lấy danh sách màu sắc từ server

    $http.get(Url + '/products/color')
        .then(function (response) {
            // Dữ liệu trả về từ API sẽ nằm trong response.data
            $scope.colors = response.data;
            console.log($scope.colors)
        })
        .catch(function (error) {
            console.log(error);
        });



    $scope.logSelectedColors = function (selectedColorName) {
        // Lấy tất cả các phần tử input có type là checkbox
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        // Lưu giá trị từ các checkbox
        var selectedColors = [];
        // Duyệt qua từng checkbox và kiểm tra xem nó có được chọn và hiển thị không
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked && checkbox.offsetParent !== null) {
                var colorName = checkbox.id;
                selectedColors.push(colorName);
            }
        });
        console.log(selectedColors);
        $scope.selectedColors = selectedColors;
    };



});