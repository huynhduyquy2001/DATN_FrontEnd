angular.module('myApp').controller('loginController', function ($scope, $http) {

    $scope.user = {};
    $scope.login = function () {
        // Assuming your API expects data in the format { username: '', password: '' }
        userData = {
            phoneNumber: $scope.user.phoneNumber,
            password: $scope.user.password
        };
        $http.post('https://viesonetapi2.azurewebsites.net/api/createToken', userData)
            .then(function (response) {
                // Store the token in local storage
                localStorage.setItem('jwtToken', response.data.accessToken);        
                window.location.href = "Index.html"
            })
            .catch(function (error) {
                $scope.error = "Đăng nhập thất bại, kiểm tra lại tài khoản mật khẩu";
            });
    };

});