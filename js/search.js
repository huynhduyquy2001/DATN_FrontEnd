



app.controller('SearchController', function ($scope, $http, $translate, $rootScope, $location) {

	const firebaseConfig = {
		apiKey: "AIzaSyB_nFfKhlG0KP5lU6d3gqQwniuDHnnI8JE",
		authDomain: "search-history-453d4.firebaseapp.com",
		databaseURL: "https://search-history-453d4-default-rtdb.firebaseio.com",
		projectId: "search-history-453d4",
		storageBucket: "search-history-453d4.appspot.com",
		messagingSenderId: "308907237461",
		appId: "1:308907237461:web:97a517ea4387f1df4af4dc",
		measurementId: "G-J3T65DFKHD"
	};
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	}
	// firebase.auth().signInWithEmailAndPassword('daynewtran@gmail.com', 'daynewtran123')
	// 	.then(function (userCredential) {
	// 		// Người dùng đã đăng nhập thành công
	// 		const user = userCredential.user;
	// 	})
	// 	.catch(function (error) {
	// 		// Xử lý lỗi xác thực, bao gồm cả lỗi 401
	// 		console.error("Lỗi xác thực:", error);
	// 	});


	var Url = "http://localhost:8080";
	$scope.Posts = [];
	$scope.likedPosts = [];
	$scope.myAccount = {};
	$scope.postData = {};
	$scope.item = {};
	$scope.listFollow = [];
	$scope.usernameS = $rootScope.keyS;
	var findMyAccount = "http://localhost:8080/findmyaccount";
	// Kiểm tra xem còn tin nhắn nào chưa đọc không
	$http.get(Url + '/getunseenmessage')
		.then(function (response) {
			$rootScope.check = response.data > 0;
			$rootScope.unseenmess = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});

	//Đa ngôn ngữ	
	$scope.changeLanguage = function (langKey) {
		$translate.use(langKey);
		localStorage.setItem('myAppLangKey', langKey); // Lưu ngôn ngữ đã chọn vào localStorage
	};

	$scope.TimKiem = function (key) {
		//$scope.LS();
		$scope.showName(key);
	};

	$scope.chooseKey = function (word) {
		$scope.usernameS = word;
		$scope.findProductNoSplitText();
	};
	// Khởi tạo biến $scope.words là một mảng để lưu trữ các từ
	$scope.words = [];
	// Hàm để tách chuỗi thành danh từ, tính từ và động từ
	$scope.splitText = function (sentenceS) {
		var words = sentenceS.split(/[ ,.]+/); // Tách chuỗi thành các từ

		// Xóa nội dung cũ của $scope.words
		$scope.words.length = 0;

		// Lặp qua từng từ để xác định loại (danh từ, tính từ hoặc động từ)
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			var nextWord = words[i + 1];

			if (word.match(/[a-zA-Z]/)) {
				// Kiểm tra nếu từ chứa chữ cái (tiếng Việt)
				if (nextWord) {
					var combinedWord = word + ' ' + nextWord;

					if (nextWord.endsWith("ng")) {
						$scope.words.push(combinedWord);
						i++; // Bỏ qua từ tiếp theo vì đã kết hợp thành động từ
					} else {
						$scope.words.push(word);
					}
				} else {
					$scope.words.push(word);
				}
			}
		}
		console.log($scope.words);
	};
	$scope.findProductNoSplitText = function () {
		if (username === "") {
			$scope.users = []; // Đặt danh sách người dùng thành rỗng
			return; // Không gọi API, dừng hàm tìm kiếm ở đây
		}
		$rootScope.keyS = $scope.usernameS;
		// Sử dụng tham số truy vấn 'name' bằng cách thêm vào UR
		$http.get(Url + '/user/search/' + $scope.usernameS)
			.then(function (res) {
				$scope.users = res.data;
				if ($scope.users.length === 0) {
					$scope.searchnull = "Không tìm thấy người dùng"; // Thông báo khi không tìm thấy người dùng
				} else {
					$scope.searchnull = ""; // Ẩn thông báo khi tìm thấy người dùng
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
	$scope.findProduct = function (username) {
		if (username === "") {
			$scope.users = []; // Đặt danh sách người dùng thành rỗng
			return; // Không gọi API, dừng hàm tìm kiếm ở đây
		}
		$scope.splitText($scope.usernameS);

		$rootScope.keyS = $scope.usernameS;
		// Sử dụng tham số truy vấn 'name' bằng cách thêm vào URL
		$http.get(Url + '/user/search/' + username)
			.then(function (res) {
				$scope.users = res.data;
				if ($scope.users.length === 0) {
					$scope.searchnull = "Không tìm thấy người dùng"; // Thông báo khi không tìm thấy người dùng
				} else {
					$scope.searchnull = ""; // Ẩn thông báo khi tìm thấy người dùng
				}
			})
			.catch(function (error) {
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
		const handledText = text.toLowerCase();

		const location = handledText[1];

		console.log('location', location);
		searchInput.value = handledText;
		// const changeEvent = new Event('change');
		// searchInput.dispatchEvent(changeEvent);
		$scope.findProduct(handledText);
		searchInput.dispatchEvent($scope.findProduct(handledText));
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

















































	$http.get(Url + '/ListFollowing')
		.then(function (response) {
			$scope.followings = response.data;
			console.log($scope.followings); // Kiểm tra dữ liệu trong console log
		})
		.catch(function (error) {
			console.log(error);
		});
	$http.get(Url + '/getUserInfo').then(function (response) {
		$scope.UserInfo = response.data;
		$scope.birthday = new Date($scope.UserInfo.birthday)
		// Khởi tạo biến $scope.UpdateUser để lưu thông tin cập nhật

		$scope.UpdateUser = angular.copy($scope.UserInfo);

	});
	$scope.myGallary = function () {
		var currentUserId = $scope.UserInfo.userId;

	}
	$scope.followUser = function (followingId) {
		var currentUserId = $scope.UserInfo.userId;
		var data = {
			followerId: currentUserId,
			followingId: followingId
		};
		$http.post(Url + '/follow', data)
			.then(function (response) {
				// Thêm follow mới thành công, cập nhật trạng thái trong danh sách và chuyển nút thành "Unfollow"
				$scope.listFollow.push(response.data);
				console.log("Success Follow!");

				// Cập nhật lại danh sách follow sau khi thêm mới thành công
				$scope.refreshFollowList();
			})
			.catch(function (error) {
				console.log("Lỗi F", error);
			});
	};

	$scope.unfollowUser = function (followingId) {
		var currentUserId = $scope.UserInfo.userId;
		var data = {
			followerId: currentUserId,
			followingId: followingId
		};
		$scope.refreshFollowList();
		$http.delete(Url + '/unfollow', { data: data, headers: { 'Content-Type': 'application/json' } })
			.then(function (response) {
				// Cập nhật lại danh sách follow sau khi xóa thành công
				$scope.listFollow = $scope.listFollow.filter(function (follow) {
					console.log("Success Unfollow!");
					$scope.refreshFollowList();
					return !(follow.followerId === currentUserId && follow.followingId === followingId);

				});
			}, function (error) {
				console.log("Lỗi UnF", error);
			});
	};

	// Hàm làm mới danh sách follow
	$scope.refreshFollowList = function () {
		$http.get(Url + '/ListFollowing')
			.then(function (response) {
				$scope.followings = response.data;
				console.log($scope.followings); // Kiểm tra dữ liệu trong console log
			})
			.catch(function (error) {
				console.log(error);
			});
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
			if (hours === 0 && minutes < 60) {
				return minutes + ' phút trước';
			} else if (hours < 24) {
				return hours + ' giờ trước';
			}
		} else if (days === 1) {
			return 'hôm qua';
		} else {
			return days + ' ngày trước';
		}
	};

	$http.get(findMyAccount)
		.then(function (response) {
			$scope.myAccount = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});

});