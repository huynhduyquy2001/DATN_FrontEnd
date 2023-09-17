app.controller('registerCtrl', function ($scope, $http, $translate, $rootScope, $location) {
    var url = "http://localhost:8080";

    $scope.gender = 'true';

    $scope.guiMa = function (event) {
        var email = $scope.email;
        var username = $scope.username;
        var data = {
            email: email,
            username: username
        };

        $http({
            method: 'POST',
            url: '/dangky/guima',
            data: data,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function (response) {
                var result = response.data;
                if (result.message) {
                    $scope.errorMessage = result.message;
                } else {
                    $scope.errorMessage = '',
                        Swal.fire(
                            'Đã gửi!',
                            'Mật mã đã gửi đến bạn!',
                            'success'
                        )
                }
            })
            .catch(function (error) {
                console.log(error);
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
            code: code
        };

        // Gửi yêu cầu HTTP đến URL /dangky với phương thức POST
        $http.post(url + '/dangky', data).then(function (response) {
            // Xử lý phản hồi từ máy chủ tại đây
            if (response.data.message) {
                // Hiển thị thông báo lỗi cho người dùng
                $scope.errorMessage = response.data.message;
            } else {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Đăng ký tài khoản!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    // Check if the user clicked the "OK" button
                    if (result.isConfirmed) {
                        // Redirect to another page
                        window.location.href = '/login'; // Replace '/another-page' with the desired URL
                    }
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