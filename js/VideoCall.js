app.controller("VideoCallController", function ($scope, $http, $translate, $rootScope, $location, $routeParams, $document) {

    //hàm xử lí cuộc gọi
    $scope.settingCallEvent = function (call1, localVideo, remoteVideo) {
        call1.on('addremotestream', function (stream) {
            // reset srcObject to work around minor bugs in Chrome and Edge.
            console.log('addremotestream');
            $scope.onMic = true;
            remoteVideo.srcObject = null;
            remoteVideo.srcObject = stream;
            $scope.$apply();
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
    $scope.onMic = false;
    $scope.checkVideo = false;
    var findMyAccount = "http://localhost:8080/findmyaccount";
    var url = "http://localhost:8080";
    $scope.callerId = "";
    $scope.callIsAllowed = true;
    var sound = null;
    $scope.yourAccount = {};
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

    if ($routeParams.userId) {
        $http.get(url + '/getUser/' + $routeParams.userId)
            .then(function (response) {
                $scope.yourAccount = response.data;
            })
    }

    // ===================================================================================//


    $scope.makeVideoCall = function () {
        try {
            $rootScope.client.connect($rootScope.token);
            $scope.checkVideo = true;
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
    };
    $scope.makeCall = function () {
        try {
            $rootScope.client.connect($rootScope.token);
            $rootScope.currentCall = new StringeeCall($rootScope.client, $scope.callerId, $scope.calleeId, false);
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
    };

    //hàm thông báo người ta gọi
    $rootScope.client.on('incomingcall', function (incomingcall) {
        //$('#incoming-call-notice').show();
        console.log("incomingcall", incomingcall)
        $rootScope.currentCall = incomingcall;
        sound = new Howl({
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
        sound.stop();
        if ($rootScope.currentCall != null) {
            $rootScope.currentCall.answer(function (res) {
                console.log('+++ answering call: ', res);
            });
        }
        $rootScope.checkCall = 2;
        $scope.checkVideo = true;
        $scope.onMic = true;
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

    // Lấy kích thước ban đầu của cửa sổ trình duyệt
    var originalWidth = window.innerWidth;
    var originalHeight = window.innerHeight;

    // Ngăn trình duyệt thay đổi kích thước
    window.onresize = function () {
        window.resizeTo(originalWidth, originalHeight);
    };

    window.addEventListener('beforeunload', function (e) {
        // Gọi hàm "endCall" của bạn ở đây.
        $scope.endCall();
        return true;
    });

    // Ngăn nút maximize trong một phạm vi cụ thể
    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) {
            window.resizeTo(800, window.innerHeight);
        }
    });

}
);
