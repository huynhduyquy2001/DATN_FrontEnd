angular.module('myApp').controller('loginController', function ($scope, $http) {

    $scope.user = {};
    $scope.login = function () {
        // Assuming your API expects data in the format { username: '', password: '' }
        userData = {
            phoneNumber: $scope.user.phoneNumber,
            password: $scope.user.password
        };
        $http.post('http://localhost:8080/api/createToken', userData)
            .then(function (response) {
                // Store the token in local storage
                localStorage.setItem('jwtToken', response.data.accessToken);
                $scope.error = "Đăng nhập thành công, đang chuyển đến trang chủ";
                setTimeout(function () {
                    window.location.href = "Index.html"
                }, 1000)
            })
            .catch(function (error) {
                $scope.error = "Đăng nhập thất bại, kiểm tra lại tài khoản mật khẩu";
            });
    };

});