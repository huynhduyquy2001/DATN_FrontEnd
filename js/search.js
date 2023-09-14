
app.controller('SearchController', function ($scope, $http, $translate, $rootScope, $location) {
	let host = "https://search-history-453d4-default-rtdb.firebaseio.com";
	$scope.Posts = [];
	$scope.likedPosts = [];
	$scope.myAccount = {};
	$scope.postData = {};
	$scope.item = {};
	$scope.listFollow = [];

	if (!$location.path().startsWith('/profile/')) {
		// Tạo phần tử link stylesheet
		var styleLink = document.createElement('link');
		styleLink.rel = 'stylesheet';
		styleLink.href = '/css/style.css';

		// Thêm phần tử link vào thẻ <head>
		document.head.appendChild(styleLink);
	}

	// Kiểm tra xem còn tin nhắn nào chưa đọc không
	$http.get('/getunseenmessage')
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
	// đây là code tim kiếm người dùng (tất cả)
	$scope.searchUser = function () {
		var username = $scope.username; // Lấy tên người dùng từ input hoặc form
		//var username = $scope.username.trim(); // Lấy tên người dùng từ input hoặc form và loại bỏ khoảng trắng thừa

		// Kiểm tra nếu không có kí tự nào trong ô tìm kiếm
		if (username === "") {
			$scope.users = []; // Đặt danh sách người dùng thành rỗng
			return; // Không gọi API, dừng hàm tìm kiếm ở đây
		}
		// Gọi API để tìm kiếm người dùng
		$http.get('/user/search/users?username=' + username)
			.then(function (response) {
				// Xử lý kết quả trả về từ API
				$scope.users = response.data;
				if ($scope.users.length === 0) {
					$scope.searchnull = "Không tìm thấy người dùng"; // Thông báo khi không tìm thấy người dùng
				} else {
					$scope.searchnull = ""; // Ẩn thông báo khi tìm thấy người dùng
				}
				console.log("Tim kim thanh cong", $scope.users);
				console.log("Tim kim thanh cong nhung k co", $scope.searchnull);
			})
			.catch(function (error) {
				console.log('Lỗi khi tìm kiếm người dùng:', error);
			});
	};
	$scope.TimKiem = function (key) {
		//$scope.LS();
		$scope.showName(key);
	};
	//đây là code hiện lên lịch sử người dùng
	var url = `${host}/history.json`;
	$http.get(url).
		then(resp => {
			$scope.items = resp.data;
			console.log("Load OK lS", resp);
		}).catch(function (error) {
			console.log("Load Error", error);
		});
	//đây là code xóa lịch sử tìm kiếm
	$scope.deleteLS = function (key) {
		var url = `${host}/history/${key}.json`;
		$http.delete(url).then(resp => {
			delete $scope.items[key];
			console.log("Xóa OK", resp);
		}).catch(function (error) {
			console.log("Xóa Error", error);
		});
	}

	//đây là code shownames
	$scope.showName = function (key) {
		var url = `${host}/history/${key}.json`;
		$http.get(url).then(resp => {
			$scope.items[key] = resp.data;
			$scope.showname = $scope.items[key];
			$scope.username = $scope.showname;
			var usernameValue = $scope.username.username;
			//console.log("Showname", $scope.showname);
			console.log("Name", usernameValue);
			if (usernameValue === "") {
				$scope.users = []; // Đặt danh sách người dùng thành rỗng
				return; // Không gọi API, dừng hàm tìm kiếm ở đây
			}
			// Gọi API để tìm kiếm người dùng
			$http.get('/user/search/users?username=' + usernameValue)
				.then(function (response) {
					// Xử lý kết quả trả về từ API
					$scope.users = response.data;
					if ($scope.users.length === 0) {
						$scope.searchnull = "Không tìm thấy người dùng"; // Thông báo khi không tìm thấy người dùng
					} else {
						$scope.searchnull = ""; // Ẩn thông báo khi tìm thấy người dùng
					}
					console.log("Tim kim thanh cong");
					console.log("Tim kim thanh cong nhung k co dưới", $scope.searchnull);

				})
				.catch(function (error) {
					console.log('Lỗi khi tìm kiếm người dùng:', error);
				});
		}).catch(function (error) {
			console.log("showw Error", error);
		});
	};


	$scope.LS = function () {
		var item = angular.copy($scope.username);
		var url = `${host}/history.json`;
		if (item.trim() === "") {
			console.log("Vui lòng nhập kí tự vào ô tìm kiếm.");
			return; // Không gọi API, dừng hàm tìm kiếm ở đây
		} else {
			$http.post(url, { username: item })
				.then(function (response) {
					$scope.key = response.data.name;
					$scope.item[$scope.key] = item;

					console.log("OK LS", response);
					$scope.reset();
				})
				.catch(function (error) {
					console.log("Error LS", error);
				});
		}
	};
	$scope.reset = function () {
		var url = `${host}/history.json`;
		$http.get(url).
			then(resp => {
				$scope.items = resp.data;
				console.log($scope.items);
				console.log("Load OK RS", resp);
			}).catch(function (error) {
				console.log("Load Error RS", error);
			});
	};

	$http.get('/ListFollowing')
		.then(function (response) {
			$scope.followings = response.data;
			console.log($scope.followings); // Kiểm tra dữ liệu trong console log
		})
		.catch(function (error) {
			console.log(error);
		});
	$http.get('/getUserInfo').then(function (response) {
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
		$http.post('/follow', data)
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
		$http.delete('/unfollow', { data: data, headers: { 'Content-Type': 'application/json' } })
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
		$http.get('/ListFollowing')
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
});