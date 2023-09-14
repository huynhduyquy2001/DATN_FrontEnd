app.controller('ChatController', function ($scope, $window, $http, $timeout, $translate) {
	$scope.LikePost = [];
	$scope.ListUsersMess = [];
	$scope.ListMessWith = [];
	$scope.myAccount = {};
	$scope.ListMess = [];
	$scope.userMess = {};
	$scope.check = false;
	//Đa ngôn ngữ	
	$scope.changeLanguage = function (langKey) {
		$translate.use(langKey);
		localStorage.setItem('myAppLangKey', langKey); // Lưu ngôn ngữ đã chọn vào localStorages
	};

	// Tìm acc của mình
	$http.get('/findmyaccount')
		.then(function (response) {
			$scope.myAccount = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});

	// Kiểm tra xem còn tin nhắn nào chưa đọc không
	$http.get('/getunseenmessage')
		.then(function (response) {
			$scope.check = response.data > 0;
			$scope.unseenmess = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});

	// Sử dụng $http để lấy danh sách người đã từng nhắn tin
	$http.get('/getusersmess')
		.then(function (response) {
			$scope.ListUsersMess = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});

	// Thay đổi URL SockJS tại đây nếu cần thiết
	var sockJSUrl = '/chat';

	// Tạo một đối tượng SockJS bằng cách truyền URL SockJS
	var socket = new SockJS(sockJSUrl);

	// Tạo một kết nối thông qua Stomp over SockJS
	var stompClient = Stomp.over(socket);

	// Khi kết nối WebSocket thành công
	stompClient.connect({}, function (frame) {
		console.log('Connected: ' + frame);

		// Đăng ký hàm xử lý khi nhận thông điệp từ server
		// Lắng nghe các tin nhắn được gửi về cho người dùng
		stompClient.subscribe('/user/' + $scope.myAccount.user.userId + '/queue/receiveMessage', function (message) {
			try {
				var newMess = JSON.parse(message.body);
				// Xử lý tin nhắn mới nhận được ở đây khi nhắn đúng người
				var checkMess = $scope.ListMess.find(function (obj) {
					return obj.messId === newMess.messId; // Sửa dấu === ở đây
				});
				if (checkMess) {
					checkMess.status = 'Đã ẩn';
				} else if ($scope.userMess.userId === newMess.sender.userId && !checkMess) {
					$scope.ListMess.push(newMess);
				}

				//cập nhật lại danh sách người đang nhắn tin với mình
				$http.get('/getusersmess')
					.then(function (response) {
						$scope.ListUsersMess = response.data;
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

	// Hàm gửi tin nhắn
	$scope.sendMessage = function (senderId, content, receiverId) {
		var message = {
			senderId: senderId,
			receiverId: receiverId,
			content: content
		};
		//lưu tin nhắn vào cơ sở dữ liệu
		$http.post('/savemess', message)
			.then(function (response) {
				//hàm gửi tin nhắn qua websocket
				stompClient.send('/app/sendnewmess', {}, JSON.stringify(response.data));
				//cập nhật lại tin nhắn và những người đã gửi bên cột những người đã gửi
				var check = response.data;
				var existingUserIndex = $scope.ListUsersMess.findIndex(function (obj) {
					return check.receiver.userId === obj[0] || check.receiver.userId === obj[2];
				});

				var newObj = {
					0: check.sender.userId,
					1: check.sender.username,
					2: check.receiver.userId,
					3: check.receiver.username,
					4: check.sender.avatar,
					5: check.receiver.avatar,
					6: check.content,
					7: new Date(),
					8: "Đã gửi",
					9: check.messId
				};

				if (existingUserIndex !== -1) {
					// Nếu người nhận đã tồn tại trong danh sách, cập nhật thông tin tin nhắn mới nhất
					$scope.ListUsersMess.splice(existingUserIndex, 1);
				}

				// Thêm tin nhắn mới vào đầu danh sách
				$scope.ListUsersMess.unshift(newObj);

				//cập nhật tin nhắn bên người gửi
				var newMess = {
					sender: { userId: senderId, username: $scope.myAccount.user.username, avatar: $scope.myAccount.user.avatar },
					receiver: { userId: receiverId },
					content: content,
					sendDate: new Date(),
					messId: check.messId
				};

				$scope.ListMess.push(newMess);
			})
			.catch(function (error) {
				console.log(error);
			});
		console.log('Tin nhắn đã được gửi thành công!');
		$scope.newMess = '';

		var foundUser = $scope.ListUsersMess.find(function (user) {
			return user.userId === receiverId;
		});
		if (foundUser) {
			foundUser.status = 'Đã gửi';
		}

		$timeout(function () {
			$scope.scrollToBottom();
		}, 100);
	};

	// Tìm người đang nhắn với mình
	$scope.getmess2 = function (userId, messId, status) {
		$http.post('/getUser/' + userId)
			.then(function (response) {
				$scope.userMess = response.data;
				return $http.get('/getmess2/' + userId);
			})
			.then(function (response) {
				$scope.ListMess = response.data;
				$timeout(function () {
					$scope.scrollToBottom();
				}, 100);
			})
			.catch(function (error) {
				console.log(error);
			});

		$http.post('/seen/' + userId)
			.then(function (response) {
				return $http.get('/getunseenmessage');
			})
			.then(function (response) {
				$scope.check = response.data > 0;
			})
			.catch(function (error) {
				console.log(error);
			});

		if (messId !== -1 && status === 'Đã gửi') {
			var messToUpdate = $scope.ListUsersMess.find(function (mess) {
				return mess[9] === messId;
			});
			messToUpdate[8] = "Đã xem";
		}
	};

	$scope.scrollToBottom = function () {
		var chatContainer = document.querySelector('.msger-chat');
		chatContainer.scrollTop = chatContainer.scrollHeight;
	};

	$scope.getFormattedTimeAgo = function (date) {
		var currentTime = new Date();
		var activityTime = new Date(date);
		var timeDiff = currentTime.getTime() - activityTime.getTime();
		var seconds = Math.floor(timeDiff / 1000);
		var minutes = Math.floor(timeDiff / (1000 * 60));
		var hours = Math.floor(timeDiff / (1000 * 60 * 60));
		var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

		if (days === 0) {
			if (hours === 0 && minutes === 0) {
				return 'vài giây trước';
			} else if (hours === 0) {
				return minutes + ' phút trước';
			} else {
				return hours + ' giờ trước';
			}
		} else if (days === 1) {
			var formattedTime = 'Hôm qua';
			var hours = String(activityTime.getHours()).padStart(2, '0');
			var minutes = String(activityTime.getMinutes()).padStart(2, '0');
			var seconds = String(activityTime.getSeconds()).padStart(2, '0');
			formattedTime += ' ' + hours + ':' + minutes;
			return formattedTime;

		} else {
			var formattedTime = activityTime.getDate() + '-' + (activityTime.getMonth() + 1) + '-' + activityTime.getFullYear();
			var hours = String(activityTime.getHours()).padStart(2, '0');
			var minutes = String(activityTime.getMinutes()).padStart(2, '0');
			var seconds = String(activityTime.getSeconds()).padStart(2, '0');
			formattedTime += ' ' + hours + ':' + minutes;
			return formattedTime;
		}
	};

	$scope.logout = function () {
		$http.get('/logout')
			.then(function () {
				$window.location.href = '/login';
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	$scope.revokeMessage = function (messId) {
		$http.post('/removemess/' + messId)
			.then(function (reponse) {
				var messToUpdate = $scope.ListMess.find(function (mess) {
					return mess.messId === messId;
				})
				messToUpdate.status = "Đã ẩn";

				var mess = reponse.data;

				var objUpdate = $scope.ListUsersMess.find(function (obj) {
					return (mess.receiver.userId === obj[0] || mess.receiver.userId === obj[2]) && mess.messId === obj[9];
				});
				if (objUpdate) {
					Object.assign(objUpdate, {
						0: mess.sender.userId,
						1: mess.sender.username,
						2: mess.receiver.userId,
						3: mess.receiver.username,
						4: mess.sender.avatar,
						5: mess.receiver.avatar,
						6: mess.content,
						7: new Date(),
						8: "Đã ẩn",
						9: mess.messId
					});
				}
				stompClient.send('/app/sendnewmess', {}, JSON.stringify(mess));



			}, function (error) {
				console.log(error);
			});
	};
});
