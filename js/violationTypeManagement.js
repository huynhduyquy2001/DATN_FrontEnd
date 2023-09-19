app.controller('VtmCtrl', function ($scope, $http, $translate, $rootScope, $location) {
    $scope.listViolationType = [];
    $scope.listViolation = {};
    $scope.violation = {};

    var url = "http://localhost:8080";

    $http.get(url + '/staff/violationtype/load').then(function (response) {
        // Gán dữ liệu từ API vào biến $scope.listViolations
        originalList = response.data;
        $scope.listViolationType = response.data;
    }).catch(function (error) {
        console.error('Lỗi khi lấy dữ liệu bài viết vi phạm:', error);
    });

    //Hàm tải dữ liệu ban đầu
    function loadInitialData() {
        $http.get(url + '/staff/violationtype/load')
            .then(function (response) {
                // Lưu trữ danh sách gốc vào biến originalList
                originalList = response.data;
                // Gán danh sách cho biến $scope.listViolations để hiển thị
                $scope.listViolationType = response.data;
            })
            .catch(function (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            });
    }

    $scope.searchByDescription = function () {
        var description = $scope.searchText;
        
        if (!description) {
            // Nếu ô tìm kiếm rỗng, gán lại bản sao của danh sách gốc cho $scope.listViolationType
            $scope.listViolationType = angular.copy(originalList);
            return;
        }
        $http.get(url + '/staff/violationtype/searchViolationDescription', { params: { description: description } })
            .then(function (response) {
                // Xử lý kết quả tìm kiếm ở đây
                $scope.listViolationType = response.data;
            })
            .catch(function (error) {
                console.error('Lỗi khi tìm kiếm bài viết:', error);
            });
    };

    $scope.addViolationModal = function() {
        // Show the modal
        $('#addViolationModal').modal('show');
    };

    $scope.addViolation = function() {	        
        var violationDescription = $scope.violationDescription;

        var data = {	           
            violationDescription: violationDescription
        };

        $http({
            method: 'POST',
            url: url + '/staff/violationtype/addViolationDescription',
            data: data,
            headers: { 'Content-Type': 'application/json' }
        })
        .then(function(response) {
            // Handle success response here
            // For example, show a success message
            Swal.fire({
                title: 'Thành công!',
                text: 'Thêm vi phạm thành công!',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(function(result) {
                if (result.isConfirmed) {
                    // Reload the page to update the table
                    window.location.reload();
                }
            });
        })
        .catch(function(error) {
            // Handle error response here
            // For example, show an error message
            Swal.fire({
                title: 'Lỗi!',
                text: 'Đã xảy ra lỗi khi thêm vi phạm!',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            });
        });
    };


 
    // Hàm xem chi tiết bài viết
    $scope.detailViolation = function (violationTypeId) {
        // Gọi API để lấy thông tin chi tiết bài viết dựa vào postId
        $http.get(url + '/staff/violationtype/detailViolation/' + violationTypeId)
            .then(function (response) {
                $scope.violation = response.data;
                $('#exampleModal').modal('show'); // Hiển thị modal khi có dữ liệu bài viết
            })
            .catch(function (error) {
                console.error('Lỗi khi lấy thông tin chi tiết bài viết:', error);
            });
        $http.get(url + '/staff/violationtype/detailViolation/' + violationTypeId)
            .then(function (response) {
                $scope.listViolation = response.data;
            })
            .catch(function (error) {
                console.error('Lỗi khi lấy thông tin chi tiết vi phạm:', error);
            });
    };

    

    $scope.submitForm = function(violationTypeId) {
        var violationDescription = $scope.violationDescription;

        var data = {
            violationDescription: violationDescription
        };

        $http({
            method: 'POST',
            url: url + '/staff/violationtype/updateViolationDescription/' + violationTypeId,
            data: JSON.stringify(data), // Chuyển đổi data thành chuỗi JSON
            headers: { 'Content-Type': 'application/json' }
        })
        .then(function(response) {
            var result = response.data;
            if (result.message) {
                $scope.errorMessage = result.message;
            } else {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Cập nhật thành công!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    // Check if the user clicked the "OK" button
                    if (result.isConfirmed) {
                        // Reload the page to update the table
                        window.location.reload();
                    }
                });
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    };


});