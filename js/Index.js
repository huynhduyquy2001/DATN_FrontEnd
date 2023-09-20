
var app = angular.module('myApp', ['pascalprecht.translate', 'ngRoute'])

// Tạo một directive để theo dõi URL hiện tại
app.directive('activeLink', ['$location', function ($location) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.$on('$routeChangeSuccess', function () {
				var path = $location.path();
				var href = attrs.href.replace('#!', ''); // Loại bỏ tiền tố '#!'

				// So sánh URL hiện tại với href của liên kết
				if (path === href) {
					element.css('background-color', 'rgba(93, 135, 255)');
					element.css('color', 'white');
				} else {
					element.css('background-color', ''); // Xóa CSS nền
					element.css('color', '#313131');
				}
			});
		}
	};
}]);

app.config(function ($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
})
app.factory('AuthInterceptor', function ($q, $window) {
	return {
		responseError: function (rejection) {
			if (rejection.status === 403) {
				// Redirect to the login page
				$window.location.href = 'login.html';
			}
			return $q.reject(rejection);
		}
	}
})
app.factory('apiService', function ($http) {
	// Function to get the JWT token from local storage
	function getJwtToken() {
		// Replace 'YOUR_JWT_TOKEN_KEY' with the key you used to store the token in local storage
		console.log(localStorage.getItem('jwtToken'))
		return localStorage.getItem('jwtToken');
	}

	// Function to set the JWT token in the HTTP headers of the API request
	function setAuthorizationHeader() {
		var jwtToken = getJwtToken();
		if (jwtToken) {
			$http.defaults.headers.common['Authorization'] = 'Bearer ' + jwtToken;
		}
	}

	// Function to remove the JWT token from the HTTP headers
	function removeAuthorizationHeader() {
		delete $http.defaults.headers.common['Authorization'];
	}

	// Expose the public methods of the factory
	return {
		setAuthorizationHeader: setAuthorizationHeader,
		removeAuthorizationHeader: removeAuthorizationHeader
	};
});
app.controller('myCtrl', function ($scope, $http, $translate, $window, $rootScope, $location, $timeout, $interval, apiService) {

	apiService.setAuthorizationHeader();

	$scope.isAuthenticated = function () {
		console.log("isAuthenticated", isAuthenticated);
		return apiService.getJwtToken() !== null;
	};

	// Hàm để phát âm thanh
	var sound = new Howl({
		src: ['images/nhacchuong2.mp3']
	});
	$scope.playNotificationSound = function () {
		sound.play();
	};
	var url = "http://localhost:8080";
	var findMyAccount = "http://localhost:8080/findmyaccount";
	var getUnseenMess = "http://localhost:8080/getunseenmessage";
	var getChatlistwithothers = "http://localhost:8080/chatlistwithothers";
	var loadnotification = "http://localhost:8080/loadnotification";
	var loadallnotification = "http://localhost:8080/loadallnotification";

	$scope.myAccount = {};
	$rootScope.unseenmess = 0;
	$rootScope.check = false;
	$scope.notification = [];
	$scope.allNotification = [];
	$rootScope.postComments = [];
	$rootScope.postDetails = {};
	$scope.ListUsersMess = [];
	$scope.receiver = {};
	$scope.newMessMini = '';
	$rootScope.ListMess = [];


	// $http.get("http://localhost:8080")
	// 	.then(function (response) {

	// 	})
	// 	.catch(function (error) {
	// 		console.log(error);
	// 	});
	// $http.get("http://localhost:8080/myendpoint")
	// 	.then(function (response) {
	// 		alert("OK");
	// 	})
	// 	.catch(function (error) {
	// 		console.log(error);
	// 	});

	//lấy danh sách người đã từng nhắn tin
	$http.get(getChatlistwithothers)
		.then(function (response) {
			$scope.ListUsersMess = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});


	//xem chi tiết thông báo
	$scope.getPostDetails = function (postId) {
		$http.get(url + '/findpostcomments/' + postId)
			.then(function (response) {
				var postComments = response.data;
				$rootScope.postComments = postComments;
				console.log(response.data);
			}, function (error) {
				// Xử lý lỗi
				console.log(error);
			});
		$scope.isReplyEmpty = true;
		$http.get('url+/postdetails/' + postId)
			.then(function (response) {
				var postDetails = response.data;
				$rootScope.postDetails = postDetails;
				// Xử lý phản hồi thành công từ máy chủ
				$('#chiTietBaiViet').modal('show');

			}, function (error) {
				// Xử lý lỗi
				console.log(error);
			});
	};
	//định dạng ngày
	$scope.getFormattedTimeAgo = function (date) {
		var currentTime = new Date();
		var activityTime = new Date(date);
		var timeDiff = currentTime.getTime() - activityTime.getTime();
		var seconds = Math.floor(timeDiff / 1000);
		var minutes = Math.floor(timeDiff / (1000 * 60));
		var hours = Math.floor(timeDiff / (1000 * 60 * 60));
		var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

		if (days === 0) {
			if (hours === 0 && minutes < 60) {
				if (seconds < 60) {
					return 'vài giây trước';
				} else {
					return minutes + ' phút trước';
				}
			} else if (hours < 24) {
				return hours + ' giờ trước';
			}
		} else if (days === 1) {
			return 'Hôm qua';
		} else if (days <= 7) {
			return days + ' ngày trước';
		} else {
			// Hiển thị ngày, tháng và năm của activityTime
			var formattedDate = activityTime.getDate();
			var formattedMonth = activityTime.getMonth() + 1; // Tháng trong JavaScript đếm từ 0, nên cần cộng thêm 1
			var formattedYear = activityTime.getFullYear();
			return formattedDate + '-' + formattedMonth + '-' + formattedYear;
		}
	};
	//tìm acc bản thân
	$http.get(findMyAccount)
		.then(function (response) {
			$scope.myAccount = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});
	//Đa ngôn ngữ	
	$scope.changeLanguage = function (langKey) {
		$translate.use(langKey);
		localStorage.setItem('myAppLangKey', langKey); // Lưu ngôn ngữ đã chọn vào localStorages
	};
	// Lấy số lượng tin nhắn nào chưa đọc
	$http.get(getUnseenMess)
		.then(function (response) {
			$rootScope.check = response.data > 0;
			$rootScope.unseenmess = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});

	//tìm người mình nhắn tin và danh sách tin nhắn với người đó
	$scope.getMess = function (receiverId) {
		$http.get(url + '/getUser/' + receiverId)
			.then(function (response) {
				$scope.receiver = response.data;
			})
		$http.get(url + '/getmess2/' + receiverId)
			.then(function (response) {
				$rootScope.ListMess = response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
		var boxchatMini = document.getElementById("boxchatMini");
		boxchatMini.style.bottom = '0';
		boxchatMini.style.opacity = '1';

		angular.element(document.querySelector('.menu')).toggleClass('menu-active');
		var menu = angular.element(document.querySelector('.menu'));
		if (menu.hasClass('menu-active')) {
			menu.css("right", "0");
		} else {
			menu.css("right", "-330px");
		}
		$timeout(function () {
			var boxchatMini = document.getElementById("messMini");
			boxchatMini.scrollTop = boxchatMini.scrollHeight;
		}, 100);
	}

	//Hàm thu hồi tin nhắn
	$scope.revokeMessage = function (messId) {
		$http.post(url + '/removemess/' + messId)
			.then(function (reponse) {
				var messToUpdate = $scope.ListMess.find(function (mess) {
					return mess.messId === messId;
				})
				messToUpdate.status = "Đã ẩn";
				var mess = reponse.data;
				stompClient.send('/app/sendnewmess', {}, JSON.stringify(mess));
			}, function (error) {
				console.log(error);
			});
	};

	//Load thông báo
	$scope.hasNewNotification = false;
	$scope.notificationNumber = [];
	//Load thông báo chưa đọc
	$http.get(loadnotification)
		.then(function (response) {
			var data = response.data;
			console.log(data)
			for (var i = 0; i < data.length; i++) {
				$scope.notification.push(data[i]);
				$scope.notificationNumber = $scope.notification;
				if ($scope.notificationNumber.length != 0) {
					$scope.hasNewNotification = true;
				}
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	//Load tất cả thông báo
	$http.get(loadallnotification)
		.then(function (response) {
			$scope.allNotification = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});
	//Kết nối websocket
	$scope.ConnectNotification = function () {
		var socket = new SockJS(url + '/private-notification');
		var stompClient = Stomp.over(socket);
		stompClient.connect({}, function (frame) {
			stompClient.subscribe('/private-user', function (response) {

				var data = JSON.parse(response.body)
				// Kiểm tra điều kiện đúng với user hiện tại thì thêm thông báo mới
				if ($scope.myAccount.user.userId === data.receiver.userId) {
					//thêm vào thông báo mới
					$scope.notification.push(data);
					//thêm vào tất cả thông báo
					$scope.allNotification.push(data);
					//thêm vào mảng để đếm độ số thông báo
					$scope.notificationNumber.push(data);
					//cho hiện thông báo mới
					$scope.hasNewNotification = true;
				}
				$scope.$apply();

			});
		});
	};


	//Kết nối khi mở trang web
	$scope.ConnectNotification();

	// Tạo một đối tượng SockJS bằng cách truyền URL SockJS
	var socket = new SockJS(url + "/chat"); // Thay thế bằng đúng địa chỉ của máy chủ WebSocket

	// Tạo một kết nối thông qua Stomp over SockJS
	var stompClient = Stomp.over(socket);
	var jwt = localStorage.getItem('jwtToken');
	// Khi kết nối WebSocket thành công
	stompClient.connect({}, function (frame) {
		// Lắng nghe các tin nhắn được gửi về cho người dùng
		var jwt = localStorage.getItem('jwtToken')
		//stompClient.send('/app/authenticate', {}, JSON.stringify({ token: yourToken }));
		stompClient.subscribe('/user/' + $scope.myAccount.user.userId + '/queue/receiveMessage', function (message) {
			try {
				var newMess = JSON.parse(message.body);

				var checkMess = $rootScope.ListMess.find(function (obj) {
					return obj.messId === newMess.messId;
				});
				if (checkMess) {
					checkMess.status = 'Đã ẩn';
				}
				// Xử lý tin nhắn mới nhận được ở đây khi nhắn đúng người
				else if (($scope.receiver.userId === newMess.sender.userId || $scope.myAccount.user.userId === newMess.sender.userId) && !checkMess) {
					$rootScope.ListMess.push(newMess);
				}
				if ($scope.myAccount.user.userId !== newMess.sender.userId) {
					$scope.playNotificationSound();
				}
				//cập nhật lại danh sách người đang nhắn tin với mình
				$http.get(url + '/chatlistwithothers')
					.then(function (response) {
						$scope.ListUsersMess = response.data;
						//$scope.playNotificationSound();
					})
					.catch(function (error) {
						console.log(error);
					});

				$timeout(function () {
					$scope.scrollToBottom();
				}, 10);

				$scope.$apply();
			} catch (error) {
				alert('Error handling received message:', error);
			}
		});
	}, function (error) {
		console.error('Lỗi kết nối WebSocket:', error);
	});

	// Hàm gửi tin nhắn và lưu vào csdl
	$scope.sendMessage = function (content) {
		if (content == '' || content.trim() === undefined) {
			return;
		}
		var sender = $scope.myAccount.user.userId;
		var receiver = $scope.receiver.userId;
		var message = {
			senderId: sender,
			receiverId: receiver,
			content: content
		};
		// Lưu tin nhắn vào cơ sở dữ liệu
		$http.post(url + '/savemess', message)
			.then(function (response) {
				// Hàm gửi tin nhắn qua websocket
				stompClient.send('/app/sendnewmess', {}, JSON.stringify(response.data));

				$http.post(url + '/seen/' + receiver)
					.then(function (response) {
						$http.get(getChatlistwithothers)
							.then(function (response) {
								$rootScope.check = response.data > 0;
								$rootScope.unseenmess = response.data;
								// Làm rỗng trường nhập liệu có id "newMessMini"
								var newMessMini = document.getElementById("newMessMini");
								if (newMessMini) {
									newMessMini.value = ''; // Đặt giá trị của trường nhập liệu thành chuỗi rỗng
								}
								$timeout(function () {
									$scope.scrollToBottom();
								}, 100);
							})
							.catch(function (error) {
								console.log(error);
							});
					})
					.catch(function (error) {
						console.log(error);
					});
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	//Cuộn xuống cuổi danh sách tin nhắn
	$scope.scrollToBottom = function () {
		var chatContainer = document.getElementById("messMini");
		chatContainer.scrollTop = chatContainer.scrollHeight;
	};


	//Ẩn tất cả thông báo khi click vào xem
	$scope.hideNotification = function () {
		$http.post(url + '/setHideNotification', $scope.notification)
			.then(function (response) {
				// Xử lý phản hồi từ backend nếu cần
			})
			.catch(function (error) {
				// Xử lý lỗi nếu có
			});
		$scope.hasNewNotification = false;
		$scope.notificationNumber = [];
	}

	//Xóa thông báo
	$scope.deleteNotification = function (notificationId) {
		$http.delete(url + '/deleteNotification/' + notificationId)
			.then(function (response) {
				$scope.allNotification = $scope.allNotification.filter(function (allNotification) {
					return allNotification.notificationId !== notificationId;
				});
			})
			.catch(function (error) {
				// Xử lý lỗi nếu có
			});
	}

	//Ẩn thông báo 
	$scope.hideNotificationById = function (notificationId) {
		// Ví dụ xóa phần tử có notificationId là 123
		$scope.removeNotificationById(notificationId);
	}
	//Hàm xóa theo ID của mảng
	$scope.removeNotificationById = function (notificationIdToRemove) {
		// Lọc ra các phần tử có notificationId khác với notificationIdToRemove
		$scope.notification = $scope.notification.filter(function (notification) {
			return notification.notificationId !== notificationIdToRemove;
		});
	};


	// Trong AngularJS controller
	$scope.toggleMenu = function (event) {
		event.stopPropagation();
		angular.element(document.querySelector('.menu')).toggleClass('menu-active');
		var menu = angular.element(document.querySelector('.menu'));
		if (menu.hasClass('menu-active')) {
			menu.css("right", "0");
		} else {
			menu.css("right", "-330px");
		}
	};
	// đóng boxchatMini
	$scope.closeBoxchat = function (event) {
		event.stopPropagation();
		var boxchatMini = angular.element(document.getElementById('boxchatMini'));

		// Đặt bottom thành -500px với transition
		boxchatMini.css("bottom", "-500px");

		// Sử dụng setTimeout để đặt opacity thành 0 sau khi transition hoàn tất
		setTimeout(function () {
			boxchatMini.css("opacity", "0");
		}, 300 /* Thời gian chờ tối thiểu, có thể điều chỉnh nếu cần */);
	};
	// Đóng mở thanh menu chưa tin nhắn với những người đã gửi 
	angular.element(document).on('click', function (event) {
		var menu = angular.element(document.querySelector('.menu'));
		var toggleButton = angular.element(document.getElementById('toggle-menu'));

		if (!menu[0].contains(event.target) && event.target !== toggleButton[0]) {
			menu.css("right", "-330px");
			menu.removeClass('menu-active');
		}
	});

	// Ban đầu ẩn menu
	var menu = angular.element(document.querySelector('.menu'));
	menu.css("right", "-330px");
	// var boxchatMini = angular.element(document.getElementById('boxchatMini'));
	// boxchatMini.css("bottom", "-500px");
	// boxchatMini.css("opacity", "0");

})


