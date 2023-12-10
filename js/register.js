var app = angular.module("registerApp", []);

app.controller("registerCtrl", function ($scope, $http) {
    var url = "http://localhost:8080";
    $scope.gender = "true";

    $scope.guiMa = function (event) {
        var email = $scope.email;
        var username = $scope.username;
        var data = {
            email: email,
            username: username,
        };
        $http
            .post(url + "/api/register/sendCode", data)
            .then(function (response) {
                Swal.fire("Đã gửi!", "Mã xác nhận đã gửi đến bạn!", "success");
            })
            .catch(function (error) {
                // Xử lý lỗi ở đây
                if (error.data.message) {
                    Swal.fire({
                        title: "Lỗi!",
                        text: error.data.message,
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                }
            });

        event.preventDefault();
    };

    $scope.submitForm = function () {
        // Lấy giá trị từ các trường nhập liệu
        var phoneNumber = $scope.phoneNumber;
        var password = $scope.password;
        var confirmPassword = $scope.confirmPassword;
        var username = $scope.username;
        var email = $scope.email;
        var gender = $scope.gender;
        var accept = $scope.accept;
        var code = $scope.code;

        // Tạo đối tượng dữ liệu để gửi đi
        var data = {
            phoneNumber: phoneNumber,
            password: password,
            confirmPassword: confirmPassword,
            username: username,
            email: email,
            gender: gender,
            accept: accept,
            code: code,
        };

        // Gửi yêu cầu HTTP đến URL /dangky với phương thức POST
        $http
            .post(url + "/api/register", data)
            .then(function (response) {
                Swal.fire({
                    title: "Thành công!",
                    text: "Đăng ký tài khoản!",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                }).then((result) => {
                    // Check if the user clicked the "OK" button
                    if (result.isConfirmed) {
                        // Redirect to another page
                        window.location.href = "/Login.html"; // Replace '/another-page' with the desired URL
                    }
                });
            })
            .catch(function (error) {
                // Xử lý lỗi ở đây
                if (error.data.message) {
                    Swal.fire({
                        title: "Lỗi!",
                        text: error.data.message,
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                }
            });
    };

    $scope.openModal = function () {
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
    };
    $scope.closeModal = function () {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    };
});
