app.controller("VideoCallController", function ($scope, $http, $translate, $rootScope, $location, $routeParams, $document) {

    //hàm xử lí cuộc gọi
    $scope.settingCallEvent = function (call1, localVideo, remoteVideo) {
        call1.on('addremotestream', function (stream) {
            // reset srcObject to work around minor bugs in Chrome and Edge.
            console.log('addremotestream');
            remoteVideo.srcObject = null;
            remoteVideo.srcObject = stream;
        });

        call1.on('addlocalstream', function (stream) {
            // reset srcObject to work around minor bugs in Chrome and Edge.
            console.log('addlocalstream');
            localVideo.srcObject = null;
            localVideo.srcObject = stream;
        });

        call1.on('signalingstate', function (state) {
            console.log('signalingstate: ', state);
            if (state.code === 6 || state.code === 5)//end call or callee rejected
            {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
                Toast.fire({
                    icon: 'warning',
                    title: 'Đối phương đã từ chối cuộc gọi, cửa sổ sẽ đóng sau 3 giây...'
                });
                setTimeout(function () {
                    window.close();
                }, 3000); // 3000 milliseconds tương đương với 3 giây
                localVideo.srcObject = null;
                remoteVideo.srcObject = null;
                $rootScope.checkCall = 1;
                $scope.$apply();
                $('#incoming-call-notice').hide();
            }
        });

        call1.on('mediastate', function (state) {
            console.log('mediastate ', state);
        });

        call1.on('info', function (info) {
            console.log('on info:' + JSON.stringify(info));
        });
    }
    $rootScope.client = new StringeeClient();
    $rootScope.client.connect($rootScope.token);
    $scope.localVideo = document.getElementById('localVideo');
    $scope.remoteVideo = document.getElementById('remoteVideo');
    var findMyAccount = "http://localhost:8080/findmyaccount";
    $scope.callerId = "";
    $scope.callIsAllowed = true;

    $scope.getAccount = function () {
        $http.get(findMyAccount)
            .then(function (response) {
                $scope.callerId = response.data.user.userId;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    $scope.getAccount();
    $scope.calleeId = $routeParams.userId;

    // ===================================================================================//


    $scope.makeCall = function () {
        if ($rootScope.checkCall === 1) {
            try {
                $rootScope.client.connect($rootScope.token);
                $rootScope.currentCall = new StringeeCall($rootScope.client, $scope.callerId, $scope.calleeId, true);

                $scope.settingCallEvent($rootScope.currentCall, $scope.localVideo, $scope.remoteVideo);
                $rootScope.currentCall.makeCall(function (res) {
                    //$rootScope.$broadcast('connect_ok'); // Gửi sự kiện "connect_ok" tới toàn bộ ứng dụng
                    $rootScope.checkCall = 2;
                    $scope.$apply();
                    // console.log('+++ call callback: ', res);
                });
            } catch (error) {
                alert(error);
            }
        }
    };


    //hàm thông báo người ta gọi
    $rootScope.client.on('incomingcall', function (incomingcall) {
        //$('#incoming-call-notice').show();
        console.log("incomingcall", incomingcall)
        $rootScope.currentCall = incomingcall;
        var sound = new Howl({
            src: ['images/nhacchuong.mp3']
        });
        sound.play();
        $rootScope.checkCall = 3;
        $scope.callIsAllowed = false;
        $scope.$apply();
        $scope.settingCallEvent($rootScope.currentCall, $scope.localVideo, $scope.remoteVideo);
        //$scope.callButton.hide();
    });
    //hàm trả lời
    $scope.answerCall = function () {
        if ($rootScope.currentCall != null) {
            $rootScope.currentCall.answer(function (res) {
                console.log('+++ answering call: ', res);
            });
        }
        $rootScope.checkCall = 2;
        $scope.$apply();
    };
    //hàm từ chối
    $scope.rejectCall = function () {
        if ($rootScope.currentCall != null) {

            $rootScope.currentCall.reject(function (res) {
                console.log('+++ reject call: ', res);
                //window.location.href = "#!/message/";
                window.close();
            });
        }
    };
    //hàm kết thúc cuộc gọi
    $scope.endCall = function () {
        if ($rootScope.currentCall != null) {
            var sound = new Howl({
                src: ['images/nhacchuong.mp3']
            });
            sound.stop();
            $rootScope.currentCall.hangup(function (res) {
                console.log('+++ hangup: ', res);
                window.close(); // Đóng tab hiện tại
            });
        }
    };


    window.addEventListener("beforeunload", function (e) {
        // Hiển thị thông báo cảnh báo
        alert("Bạn có chắc chắn muốn rời khỏi trang này?");
    });
    var asideLeft = document.getElementById('asideLeft');
    asideLeft.style.display = 'none';
}
);
