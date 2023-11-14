app.controller('ChangePassController', function ($scope, $http) {
    var url = "http://localhost:8080";

    $scope.submitForm = function () {
        var matKhau = $scope.matKhau;
        var matKhauMoi = $scope.matKhauMoi;
        var matKhauXacNhan = $scope.matKhauXacNhan;

        var data = {
            matKhau: matKhau,
            matKhauMoi: matKhauMoi,
            matKhauXacNhan: matKhauXacNhan
        };

        $http
            .post(url + "/api/changePassword", data)
            .then(function (response) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Đổi mật khẩu thành công!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    // Check if the user clicked the "OK" button
                    if (result.isConfirmed) {
                        // Redirect to another page
                        window.location.href = 'Index.html'; // Replace '/another-page' with the desired URL
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