app.controller('forgotPassCtrl', function($scope, $http, $translate, $rootScope, $location) {

    var url = "http://localhost:8080";

    $scope.guiMa = function() {
        var email = $scope.email;
        var phone = $scope.phone;
        var data = {
        	email: email,
        	phone: phone
        };
        
        $http({
            method: 'POST',
            url: url + '/quenmatkhau/guima',
            data: data,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function(response) {
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
            .catch(function(error) {
                console.log(error);
            });
    };
    
    $scope.xacNhan = function() {
        var email = $scope.email;
        var matMa = $scope.matMa;
        
        var data = {
        	email: email,
        	matMa: matMa
        };
		
        if(!matMa){
        	 $scope.errorMessage = "Vui lòng điền vào mật mã đã gửi hoặc nếu chưa gửi bạn hãy nhấn gửi mã";
        	 return;
        }
        
        $http({
            method: 'POST',
            url: url + '/quenmatkhau/xacNhan',
            data: data,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function(response) {
                var result = response.data;
                if (result.message) {
                    $scope.errorMessage = result.message;                 
                } else {
                	Swal.fire({
                	    title: 'Xác nhận!',
                	    text: 'Mật mã của bạn chính xác!',
                	    icon: 'success',
                	    showCancelButton: false,
                	    confirmButtonText: 'OK'
                	}).then((result) => {
                	    // Check if the user clicked the "OK" button
                	    if (result.isConfirmed) {
                	        // Redirect to another page
                	        window.location.href = '/change_password'; // Replace '/another-page' with the desired URL
                	    }
                	});
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    };
    
});