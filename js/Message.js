
app.controller('MessController', function ($scope, $rootScope, $window, $http, $timeout, $translate, $location, $routeParams) {

	$scope.LikePost = [];
	//đây là danh sách tin nhắn
	//đây là acc của ngta
	//đây coi là có đang nhắn vs ai khum
	$scope.isEmptyObject = false;
	var url = "https://viesonetapi2.azurewebsites.net";

	$scope.openLink = function (userId) {
		var width = 840;
		var height = 600;
		var left = (window.innerWidth - width) / 2;
		var top = (window.innerHeight - height) / 2;
		window.open("http://127.0.0.1:5501/Index.html#!/videocall/" + userId, '_blank', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);

	};

	angular.element(document).ready(function () {
		// Lấy currentPath
		var currentPath = $location.path();

		// Lấy tất cả các thẻ <a> có class là "messLink"
		var messLinks = angular.element(document).find('a.messLink');

		// Duyệt qua từng thẻ <a> và kiểm tra href
		angular.forEach(messLinks, function (link) {
			var href = angular.element(link).attr('href');
			// Loại bỏ tiền tố "#!"
			href = href.replace('#!', '');
			// So sánh href với currentPath
			if (href === currentPath) {
				// Nếu khớp, thay đổi CSS của thẻ <a>
				angular.element(link).closest('li').css('background-color', 'rgba(93, 135, 255, 0.1)');
				// angular.element(link).closest('li').css('border-top', '1px solid rgb(93, 135, 255)');
				// angular.element(link).closest('li').css('border-bottom', '1px solid rgb(93, 135, 255)');
				angular.element(link).closest('li').css('color', 'white');
			}
		});
	});
	var config = {
		apiKey: "AIzaSyA6tygoN_hLUV6iBajf0sP3rU9wPboucZ0",
		authDomain: "viesonet-datn.firebaseapp.com",
		projectId: "viesonet-datn",
		storageBucket: "viesonet-datn.appspot.com",
		messagingSenderId: "178200608915",
		appId: "1:178200608915:web:c1f600287711019b9bcd66",
		measurementId: "G-Y4LXM5G0Y4"
	};

	// Kiểm tra xem Firebase đã được khởi tạo chưa trước khi khởi tạo nó
	if (!firebase.apps.length) {
		firebase.initializeApp(config);
	}

	// Hàm để lấy phần mở rộng từ tên tệp
	function getFileExtensionFromFileName(fileName) {
		return fileName.split('.').pop().toLowerCase();
	}

	// gửi ảnh qua tin nhắn
	$scope.uploadFile = function () {
		var fileInput = document.getElementById('inputGroupFile01');
		// Check if no files are selected
		if (fileInput.files.length === 0) {
			// Handle empty file selection
			return;
		}
		var storage = firebase.storage();
		var storageRef = storage.ref();

		var uploadMedia = function (fileIndex) {
			if (fileIndex >= fileInput.files.length) {
				// All files have been uploaded
				$scope.content = '';
				fileInput.value = null;
				var mediaList = document.getElementById('mediaList');
				mediaList.innerHTML = '';
				$window.selectedMedia = [];
				return;
			}

			var file = fileInput.files[fileIndex];
			var timestamp = new Date().getTime();
			var fileName = file.name + '_' + timestamp;
			var fileType = getFileExtensionFromFileName(file.name);

			// Xác định nơi lưu trữ dựa trên loại tệp
			var storagePath = fileType === 'mp4' ? 'videos/' : 'images/';

			// Tạo tham chiếu đến nơi lưu trữ tệp trên Firebase Storage
			var uploadTask = storageRef.child(storagePath + fileName).put(file);

			// Xử lý sự kiện khi tải lên hoàn thành
			uploadTask.on('state_changed', function (snapshot) {
				// Sự kiện theo dõi tiến trình tải lên (nếu cần)
			}, function (error) {
				alert("Lỗi tải");
			}, function () {
				// Tải lên thành công, lấy URL của tệp từ Firebase Storage
				uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
					var formData = new FormData();
					formData.append('mediaUrl', downloadURL);

					$http.post(url + '/sendimage/' + $scope.userMess.userId, formData, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					}).then(function (response) {
						var newListMess = response.data;
						//$rootScope.ListMess = $rootScope.ListMess.concat(newListMess);

						// Gửi từng tin nhắn trong danh sách newListMess bằng stompClient.send
						for (var i = 0; i < newListMess.length; i++) {
							var messageToSend = newListMess[i];
							stompClient.send('/app/sendnewmess', {}, JSON.stringify(messageToSend));
						}

						// Tiếp tục tải và gửi ảnh tiếp theo
						uploadMedia(fileIndex + 1);
					})
						.catch(function (error) {
							console.error('Lỗi tải lên tệp:', error);
						});

				}).catch(function (error) {
					console.error('Error getting download URL:', error);
				});
			});
		};

		// Bắt đầu tải và gửi ảnh từ fileInput.files[0]
		uploadMedia(0);
	};


	$scope.seen = function () {
		//đánh dấu là đã xem
		$http.post(url + '/seen/' + $routeParams.otherId)
			.then(function (response) {
				var check = $scope.ListUsersMess.find(function (obj) {
					return obj[2] === $routeParams.otherId;
				});
				check[11] = 0;
				//$scope.$apply();
			});
	}
	//tìm danh sách tin nhắn với người nào đó
	if ($routeParams.otherId) {
		$http.get(url + '/getUser/' + $routeParams.otherId)
			.then(function (response) {
				$rootScope.userMess = response.data;
			})
		$scope.seen();
		//lấy danh sách tin nhắn với người đó
		$http.get(url + '/getmess2/' + $routeParams.otherId)
			.then(function (response) {
				$rootScope.ListMess = response.data;
				$timeout(function () {
					$scope.scrollToBottom();
				}, 1500);
			})
			.catch(function (error) {
				console.log(error);
			});

	} else {
		$scope.isEmptyObject = true;
	}
	//kéo thả ảnh
	$scope.onDrop = function (event) {
		event.preventDefault();
		var file = event.dataTransfer.files[0]; // Lấy tệp ảnh từ sự kiện kéo và thả

		if (file.type.startsWith("image")) {
			// Gửi ảnh cho người kia
			sendImageToRecipient(file);
		}
	};

	// Tìm acc của mình
	// $http.get(url + '/findmyaccount')
	// 	.then(function (response) {
	// 		$scope.myAccount = response.data;
	// 	})
	// 	.catch(function (error) {
	// 		console.log(error);
	// 	});

	// Kiểm tra xem còn tin nhắn nào chưa đọc không
	$scope.getUnseenMessage = function () {
		$http.get(url + '/getunseenmessage')
			.then(function (response) {
				$rootScope.check = response.data > 0;
				$rootScope.unseenmess = response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	$scope.getUnseenMessage();

	//Kết nối khi mở trang web
	$scope.ConnectNotification();
	// Hàm này sẽ được gọi sau khi ng-include hoàn tất nạp tập tin "_menuLeft.html"

	// Thay đổi URL SockJS tại đây nếu cần thiết
	var sockJSUrl = url + '/chat';

	// Tạo một đối tượng SockJS bằng cách truyền URL SockJS
	var socket = new SockJS(sockJSUrl);

	// Tạo một kết nối thông qua Stomp over SockJS
	var stompClient = Stomp.over(socket);

	// Hàm gửi tin nhắn và lưu vào csdl
	$scope.sendMessage = function (senderId, content, receiverId) {
		if (content == '' || content.trim() === undefined) {
			return;
		}
		var message = {
			senderId: senderId,
			receiverId: receiverId,
			content: content
		};
		//lưu tin nhắn vào cơ sở dữ liệu
		$http.post(url + '/savemess', message)
			.then(function (response) {
				//hàm gửi tin nhắn qua websocket
				stompClient.send('/app/sendnewmess', {}, JSON.stringify(response.data));
				$http.post(url + '/seen/' + $routeParams.otherId)
					.then(function (response) {
					});

			})
			.catch(function (error) {
				console.log(error);
			});
		$scope.newMess = '';

		$timeout(function () {
			$scope.scrollToBottom();
		}, 100);
	};


	// Tìm người đang nhắn với mình
	$scope.getmess = function (userId, messId, status) {
		$http.post(url + '/seen/' + userId)
			.then(function (response) {
				return $http.get(url + '/getunseenmessage');
			})
			.then(function (response) {
				$rootScope.check = response.data > 0;
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
		var chatContainer = document.getElementById("boxChat");
		chatContainer.scrollTop = chatContainer.scrollHeight;
	};
	$scope.scrollToBottom();
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
	//Hàm thu hồi tin nhắn
	$scope.revokeMessage = function (messId) {
		$http.post(url + '/removemess/' + messId)
			.then(function (reponse) {
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


	const searchInput = document.querySelector('#text-srh');
	// Tro ly ao
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

	const recognition = new SpeechRecognition();
	const synth = window.speechSynthesis;
	recognition.lang = 'vi-VI';
	recognition.continuous = false;

	const microphone = document.querySelector('.microphone');

	const speak = (text) => {
		if (synth.speaking) {
			console.error('Busy. Speaking...');
			return;
		}

		const utter = new SpeechSynthesisUtterance(text);

		utter.onend = () => {
			console.log('SpeechSynthesisUtterance.onend');
		}
		utter.onerror = (err) => {
			console.error('SpeechSynthesisUtterance.onerror', err);
		}

		synth.speak(utter);
	};

	const handleVoice = (text) => {
		console.log('text', text);
		// "thời tiết tại Đà Nẵng" => ["thời tiết tại", "Đà Nẵng"]
		const handledText = text.toLowerCase();

		const location = handledText[1];
		console.log('location', location);
		searchInput.value = handledText;
		$scope.newMess = handledText;
		// const changeEvent = new Event('change');
		// searchInput.dispatchEvent(changeEvent);
		//searchInput.dispatchEvent($scope.findProduct(0));
		return;


		speak('Try again');
	}

	microphone.addEventListener('click', (e) => {
		e.preventDefault();

		recognition.start();
		microphone.classList.add('recording');
	});

	recognition.onspeechend = () => {
		recognition.stop();
		microphone.classList.remove('recording');
	}

	recognition.onerror = (err) => {
		console.error(err);
		microphone.classList.remove('recording');
	}

	recognition.onresult = (e) => {
		console.log('onresult', e);
		const text = e.results[0][0].transcript;
		handleVoice(text);
	}

});