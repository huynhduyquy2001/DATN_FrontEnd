var app = angular
	.module("myApp", ["pascalprecht.translate", "ngRoute"])
	.filter("currencyFormat", function () {
		return function (number) {
			return number.toLocaleString("vi-VN", {
				style: "currency",
				currency: "VND",
			});
		};
	});

// Tạo một directive để theo dõi URL hiện tại
app.directive("activeLink", [
	"$location",
	function ($location) {
		return {
			restrict: "A",
			link: function (scope, element, attrs) {
				scope.$on("$routeChangeSuccess", function () {
					var path = $location.path();
					var href = attrs.href.replace("#!", ""); // Loại bỏ tiền tố '#!'

					// So sánh URL hiện tại với href của liên kết
					if (path === href) {
						element.css("background-color", "rgba(93, 135, 255)");
						element.css("color", "white");
					} else {
						element.css("background-color", ""); // Xóa CSS nền
						element.css("color", "#313131");
					}
				});
			},
		};
	},
]);

app.config(function ($httpProvider) {
	$httpProvider.interceptors.push("AuthInterceptor");
});

app.run(function ($rootScope, $window, apiService) {
	// Nghe sự kiện thay đổi đường dẫn
	$rootScope.$on("$locationChangeSuccess", function () {
		// Kiểm tra token khi đường dẫn thay đổi
		apiService.setAuthorizationHeader();

	});
});

app.factory("AuthInterceptor", function ($q, $window) {
	return {
		responseError: function (rejection) {
			if (rejection.status === 403) {
				// Redirect to the login page
				$window.location.href = "Login.html";
			}
			if (rejection.status === 401) {
				alert("ok")
				// Redirect to the login page
				//$window.location.href = "Login.html";
			}
			return $q.reject(rejection);
		},
	};
});

app.factory("apiService", function ($http, $q, $window) {
	var apiService = {};

	// Function to set the JWT token in the HTTP headers of the API request
	apiService.setAuthorizationHeader = function () {
		var jwtToken = apiService.getJwtToken();
		if (jwtToken) {
			$http.defaults.headers.common["Authorization"] = "Bearer " + jwtToken;
			// Check if the token is expired
			if (apiService.isTokenExpired(jwtToken)) {
				Swal.fire({
					title: "Thông báo!",
					text: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
					icon: "warning",
					showCancelButton: false,
					confirmButtonText: "OK",
				}).then((result) => {
					// Check if the user clicked the "OK" button
					if (result.isConfirmed) {
						apiService.removeAuthorizationHeader();
						localStorage.removeItem("jwtToken");
						$window.location.href = "Login.html";
					}
				});
			}

		}
	};

	// Function to remove the JWT token from the HTTP headers
	apiService.removeAuthorizationHeader = function () {
		delete $http.defaults.headers.common["Authorization"];
	};

	apiService.getJwtToken = function () {
		return localStorage.getItem("jwtToken");
	};

	// Function to check if the JWT token is expired
	apiService.isTokenExpired = function (token) {
		// Decode the token to get information
		var base64Url = token.split(".")[1];
		var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		var decodedToken = JSON.parse($window.atob(base64));

		// Check if the token is expired
		return decodedToken.exp < Date.now() / 1000;
	};

	return apiService;
});

app.controller('myCtrl', function ($scope, $http, $translate, $window, $rootScope, $location, $timeout, $interval, apiService) {

	apiService.setAuthorizationHeader();


	$scope.isAuthenticated = function () {
		console.log("isAuthenticated", isAuthenticated);
		return apiService.getJwtToken() !== null;
	};

	// Hàm để phát âm thanh

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
	$scope.postDetails = {};
	$scope.ListUsersMess = [];
	$scope.receiver = {};
	$scope.newMessMini = '';
	$scope.ListMessMini = [];
	$rootScope.myAccount = {};
	$rootScope.listProduct = [];
	//phân trang shopping
	$rootScope.checkShopping = 1;
	$rootScope.currentPage = 0;
	$rootScope.currentPageSearch = 0;
	$rootScope.currentPageTrending = 0;
	$rootScope.checkMenuLeft = true;
	$rootScope.key = "";
	$rootScope.keyS = "";

	//Phân trang order
	$rootScope.checkOrderPage = 1;

	//Phân trang myStore
	$rootScope.currentPageMyStore = 0;
	$rootScope.currentPagePending = 0;
	$rootScope.currentPageFilter = 0;
	$rootScope.checkMystore = 1;
	//trang sản phẩm iu thích
	$rootScope.currentPagefavoriteProducts = 0;
	//nhắn tin
	$rootScope.userMess = {};
	$rootScope.ListMess = [];
	//gọi điện
	$rootScope.token = "";
	$rootScope.callerId = "";
	$rootScope.currentCall = null;
	$rootScope.checkCall = 1;
	// Kiểm tra xem trình duyệt hỗ trợ HTML5 Notifications hay không

	$http.get(url + '/generateToken')
		.then(function (response) {
			$rootScope.token = response.data.token;

		})
		.catch(function (error) {
			console.error("Error:", error);
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



	//xem chi tiết bài viết
	$scope.getPostDetails = function (postId) {
		$http.get(url + '/findpostcomments/' + postId)
			.then(function (response) {
				var postComments = response.data;
				$rootScope.postComments = postComments;
			}, function (error) {
				// Xử lý lỗi
				console.log(error);
			});
		$scope.isReplyEmpty = true;
		$http.get(url + '/postdetails/' + postId)
			.then(function (response) {
				var postDetails = response.data;
				$scope.postDetails = postDetails;
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
			return formattedDate + '/' + formattedMonth + '/' + formattedYear;
		}
	};

	// Tạo một đối tượng SockJS bằng cách truyền URL SockJS
	var socket = new SockJS("http://localhost:8080/chat"); // Thay thế bằng đúng địa chỉ của máy chủ WebSocket
	// Tạo một kết nối thông qua Stomp over SockJS
	var stompClient = Stomp.over(socket);
	stompClient.debug = false;
	$scope.findMyAccount = function () {
		//tìm acc bản thân
		$http.get(findMyAccount)
			.then(function (response) {
				$scope.myAccount = response.data;
				$rootScope.myAccount = response.data;

				stompClient.connect({}, function (frame) {
					// Lắng nghe các tin nhắn được gửi về cho người dùng
					//stompClient.send('/app/authenticate', {}, JSON.stringify({ token: yourToken }));
					stompClient.subscribe('/user/' + $scope.myAccount.user.userId + '/queue/receiveMessage', function (message) {
						try {
							var newMess = JSON.parse(message.body);

							var checkMess = $scope.ListMessMini.find(function (obj) {
								return obj.messId === newMess.messId;
							});


							// Xử lý tin nhắn mới nhận được ở đây khi nhắn đúng người
							//nếu người gửi là mình, muốn hiện tin nhắn lên giao diện của mình
							if (($scope.receiver.userId === newMess.receiver.userId && $scope.myAccount.user.userId === newMess.sender.userId) && !checkMess) {
								$scope.ListMessMini.push(newMess);
							}
							if (($rootScope.userMess.userId === newMess.receiver.userId && $scope.myAccount.user.userId === newMess.sender.userId) && !checkMess) {
								$rootScope.ListMess.push(newMess);
							}
							//nếu người gửi là mình, muốn hiện tin nhắn lên giao diện của người khác
							if ($scope.receiver.userId === newMess.sender.userId && $scope.myAccount.user.userId === newMess.receiver.userId) {
								$scope.ListMessMini.push(newMess);


							}
							if (($rootScope.userMess.userId === newMess.sender.userId && $scope.myAccount.user.userId === newMess.receiver.userId) && !checkMess) {
								$rootScope.ListMess.push(newMess);
							}

							if ($scope.myAccount.user.userId !== newMess.sender.userId) {
								// Lấy số lượng tin nhắn nào chưa đọc
								$http.get(getUnseenMess)
									.then(function (response) {
										$rootScope.check = response.data > 0;
										$rootScope.unseenmess = response.data;
									})
									.catch(function (error) {
										console.log(error);
									});
								//hiện popup thôg báo
								if ("Notification" in window) {
									console.log("Notification")
									Notification.requestPermission().then(function (permission) {
										if (permission === "granted") {
											// Tạo một đối tượng hình ảnh cho thông báo
											var img = new Image();
											img.src = newMess.sender.avatar; // Thay đổi đường dẫn đến ảnh thực tế

											// Hiển thị thông báo với ảnh
											var notification = new Notification("Thông báo", {
												body: newMess.sender.username + " vừa gửi tin nhắn đến bạn",
												icon: img.src // Sử dụng đường dẫn hình ảnh cho biểu tượng thông báo
											});

											// Đặt hành động khi thông báo được nhấn
											notification.onclick = function () {
												// Xử lý hành động khi thông báo được nhấn
												window.focus(); // Tập trung vào tab chính
											};
										}
									});
								}
								//$scope.playNotificationSound();
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
				//lấy danh sách người đã từng nhắn tin
				$http.get(getChatlistwithothers)
					.then(function (response) {
						$scope.ListUsersMess = response.data;
					})
					.catch(function (error) {
						console.log(error);
					});
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	$scope.findMyAccount();
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

	//tìm người mình nhắn tin và danh sách tin nhắn với người mình đã chọn
	$scope.getMess = function (receiverId) {
		$http.get(url + '/getUser/' + receiverId)
			.then(function (response) {
				$scope.receiver = response.data;
				$http.post(url + '/seen/' + receiverId)
					.then(function (response) {
						$http.get(getChatlistwithothers)
							.then(function (response) {
								$http.get(getUnseenMess)
									.then(function (response) {
										$rootScope.check = response.data > 0;
										$rootScope.unseenmess = response.data;
									})
									.catch(function (error) {
										console.log(error);
									});
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
		$http.get(url + '/getmess2/' + receiverId)
			.then(function (response) {
				$scope.ListMessMini = response.data;
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
				var messToUpdate = $scope.ListMessMini.find(function (mess) {
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
		stompClient.debug = false;
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

	$scope.getTotalUnseenMess = function () {
		// Lấy số lượng tin nhắn nào chưa đọc
		$http.get(getUnseenMess)
			.then(function (response) {
				$rootScope.check = response.data > 0;
				$rootScope.unseenmess = response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	//Kết nối khi mở trang web
	$scope.ConnectNotification();



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

	//Xem chi tiết thông báo
	$scope.getNotificationDetail = function (postId) {
		if (postId != null) {
			$http.get(url + '/findpostcomments/' + postId)
				.then(function (response) {
					var postComments = response.data;
					$rootScope.postComments = postComments;
				}, function (error) {
					// Xử lý lỗi
					console.log(error);
				});
			$scope.isReplyEmpty = true;
			$http.get(url + '/postdetails/' + postId)
				.then(function (response) {
					var postDetails = response.data;
					$scope.postDetails = postDetails;
					// Xử lý phản hồi thành công từ máy chủ
					$('#chiTietBaiViet').modal('show');

				}, function (error) {
					// Xử lý lỗi
					console.log(error);
				});
		} else {
			$location.path('/ValidationOrder');
		}
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

	//Load thông tin giỏ hàng
	$http.get(url + '/get-product-shoppingcart').then(function (response) {
		$rootScope.listProduct = response.data;
	}).catch(function (error) {
		console.error('Lỗi khi lấy dữ liệu:', error);
	});


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

	$scope.togglerMenuLeft = function () {
		var menuLeft = angular.element(document.querySelector('#asideLeft'));
		var view = angular.element(document.querySelector('#view'));

		if (menuLeft.css('left') === '0px') {
			menuLeft.css('left', '-280px');
			menuLeft.css('opacity', '0');
			view.removeClass('col-lg-9 offset-lg-3'); // Gỡ bỏ lớp 'col-lg-9'
			view.addClass('col-lg-11 offset-lg-1');
			$rootScope.checkMenuLeft = false;
		} else {
			menuLeft.css('left', '0');
			menuLeft.css('opacity', '1');
			view.removeClass('col-lg-11 offset-lg-1');
			view.addClass('col-lg-9 offset-lg-3'); // Thêm lớp 'col-lg-9'
			$rootScope.checkMenuLeft = true;
		}
	}

	// Hàm kiểm tra kích thước màn hình và ẩn thanh asideLeft khi cần
	function checkScreenWidth() {
		var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var asideLeft = document.getElementById('asideLeft');
		var view = document.getElementById('view');
		if (screenWidth <= 1080) {
			asideLeft.style.left = '-280px';
			asideLeft.style.opacity = '0';
			view.classList.remove('col-lg-9', 'offset-lg-3');
			view.classList.add('col-lg-11', 'offset-lg-1');

		} else {
			if (view) {
				view.classList.remove('col-lg-11', 'offset-lg-1');
				view.classList.add('col-lg-9', 'offset-lg-3');
				asideLeft.style.opacity = '1';
				asideLeft.style.left = '0'; // Hoặc thay đổi thành 'block' nếu cần hiển thị lại
				$rootScope.checkMenuLeft = true;
				$scope.$apply(); // Kích hoạt digest cycle để cập nhật giao diện
			}



		}
	}

	// Gọi hàm kiểm tra khi trang được tải và khi cửa sổ thay đổi kích thước
	window.onload = checkScreenWidth;
	window.addEventListener('resize', checkScreenWidth);

	// gửi ảnh qua tin nhắn
	$scope.uploadFile = function () {
		var fileInput = document.getElementById('inputGroupFile011');
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
				var mediaList = document.getElementById('mediaList1');
				mediaList.innerHTML = '';
				$window.selectedMedia1 = [];
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

					$http.post(url + '/sendimage/' + $scope.receiver.userId, formData, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					}).then(function (response) {
						var newListMessMini = response.data;
						//$scope.ListMessMini = $scope.ListMessMini.concat(newListMessMini);

						// Gửi từng tin nhắn trong danh sách newListMessMini bằng stompClient.send
						for (var i = 0; i < newListMessMini.length; i++) {
							var messageToSend = newListMessMini[i];
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

	// Hàm để lấy phần mở rộng từ tên tệp
	function getFileExtensionFromFileName(fileName) {
		return fileName.split('.').pop().toLowerCase();
	}
	// Ban đầu ẩn menu
	var menu = angular.element(document.querySelector('.menu'));
	menu.css("right", "-330px");
	// var boxchatMini = angular.element(document.getElementById('boxchatMini'));
	// boxchatMini.css("bottom", "-500px");
	// boxchatMini.css("opacity", "0");



	// =================================================================================

	$rootScope.client = new StringeeClient();
	var generateToken = "http://localhost:8080/generateToken";
	$rootScope.getToken = function () {
		$http.get(generateToken)
			.then(function (response) {
				$rootScope.token = response.data.token;
				$rootScope.client.connect($rootScope.token);
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	$rootScope.getToken();

	//hàm thông báo người ta gọi
	$rootScope.client.on('incomingcall', function (incomingcall) {
		console.log("incomingcall", incomingcall)
		//hiện popup thôg báo
		var width = 840;
		var height = 600;
		var left = (window.innerWidth - width) / 2;
		var top = (window.innerHeight - height) / 2;
		var newWindow = window.open(
			"http://127.0.0.1:5501/#!/videocall/" + incomingcall.fromNumber,
			"_blank",
			"width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",toolbar=no,location=no,status=no,menubar=no,resizable=no"
		);
		newWindow.focus();
	});

	$scope.logout = function () {
		apiService.removeAuthorizationHeader();
		localStorage.removeItem("jwtToken");
		window.location.href = "Login.html";
	};

})


