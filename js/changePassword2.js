app.controller('Change_PassController', function($scope, $http, $translate, $rootScope, $location) {
   
    var url = "http://localhost:8080";
   
    $scope.submitForm = function() {
        var matKhau = $scope.matKhau;
        var matKhauMoi = $scope.matKhauMoi;
        var matKhauXacNhan = $scope.matKhauXacNhan;

        var data = {
        	matKhau: matKhau,
        	matKhauMoi: matKhauMoi,
        	matKhauXacNhan: matKhauXacNhan
        };

        $http({
            method: 'POST',
            url: url + '/doimatkhau2',
            data: data,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function(response) {
                var result = response.data;
                if (result.message) {
                    $scope.errorMessage = result.message;                 
                } else {
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
                	        window.location.href = '/login'; // Replace '/another-page' with the desired URL
                	    }
                	});
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    };
});