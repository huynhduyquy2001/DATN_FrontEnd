angular.module('myApp').controller('loginController', function ($scope, $http) {

    $scope.user = {};
    $scope.check = function () {
        // Lấy mã thông báo JWT từ local storage
        var jwtToken = localStorage.getItem("jwtToken");

        // Kiểm tra xem mã thông báo JWT có tồn tại không
        if (jwtToken) {
            // Giải mã mã thông báo JWT
            var decodedToken = parseJwt(jwtToken);

            // Kiểm tra thời gian hết hạn của mã thông báo
            var currentTimestamp = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại (đơn vị: giây)
            if (decodedToken.exp && decodedToken.exp > currentTimestamp) {
                // Nếu mã thông báo chưa hết hạn, hiển thị cảnh báo với thông báo "Chưa hết hạn"
                window.location.href = "/#!/";
            } else {
                // Nếu mã thông báo đã hết hạn, hiển thị cảnh báo với thông báo "Đã hết hạn"

            }
        }
    }

    // Hàm giải mã JWT
    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    $scope.check();
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
                window.location.href = "/#!/"
            })
            .catch(function (error) {
                $scope.error = "Đăng nhập thất bại, kiểm tra lại tài khoản mật khẩu";
            });
    };

});