var app = angular.module("forgotPassApp", []);
app.controller("forgotPassCtrl", function ($scope, $http) {
    var url = "http://localhost:8080";

    $scope.guiMa = function () {
        var phone = $scope.phone;
        var data = {
            phone: phone,
        };

        $http
            .post(url + "/api/forgetPassword/sendCode", data)
            .then(function (response) {
                Swal.fire("Đã gửi!", "Mã xác nhận đã gửi đến mail của bạn!", "success");
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

    $scope.xacNhan = function () {
        var matMa = $scope.matMa;
        var matKhauMoi = $scope.matKhauMoi;
        var matKhauXacNhan = $scope.matKhauXacNhan;

        var data = {
            matMa: matMa,
            matKhauMoi: matKhauMoi,
            matKhauXacNhan: matKhauXacNhan,
        };

        $http
            .post(url + "/api/forgetPassword", data)
            .then(function (response) {
                Swal.fire({
                    title: "Thành công!",
                    text: "Bạn đã đổi mật khẩu thành công",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "OK",
                }).then((result) => {
                    // Check if the user clicked the "OK" button
                    if (result.isConfirmed) {
                        // Redirect to another page
                        window.location.href = "Login.html"; // Replace '/another-page' with the desired URL
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
});
