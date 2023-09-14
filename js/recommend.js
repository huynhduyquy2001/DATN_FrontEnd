
app.controller('RecommendController', function ($scope, $http, $translate, $rootScope, $location) {
	$scope.Posts = [];
	$scope.likedPosts = [];
	$scope.myAccount = {};
	$scope.postData = {};
	$scope.item = {};
	$scope.followers = [];
	$scope.followings = [];
	$scope.users = [];
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
	$http.get('/ListFollower')
		.then(function (response) {
			$scope.users = response.data;
			console.log("User", $scope.users); // Kiểm tra dữ liệu trong console 

		})
		.catch(function (error) {
			console.log("Lỗi load user", error);
		});

	//Đa ngôn ngữ	
	$scope.changeLanguage = function (langKey) {
		$translate.use(langKey);
		localStorage.setItem('myAppLangKey', langKey); // Lưu ngôn ngữ đã chọn vào localStorages
	};


	$http.get('/ListFollowing')
		.then(function (response) {
			$scope.followings = response.data;
			console.log("ListFollowing1", $scope.followings); // Kiểm tra dữ liệu trong console log
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
		$http.delete('/unfollow', { data: data, headers: { 'Content-Type': 'application/json' } })
			.then(function (response) {
				// Cập nhật lại danh sách follow sau khi xóa thành công
				$scope.listFollow = $scope.listFollow.filter(function (follow) {

					return !(follow.followerId === currentUserId && follow.followingId === followingId);
				});
			}, function (error) {
				console.log("Lỗi ÙnF", error);
			});
	};


	// Hàm làm mới danh sách follow
	$scope.refreshFollowList = function () {
		$http.get('/ListFollower')
			.then(function (response) {
				$scope.users = response.data;
				console.log("User", $scope.users); // Kiểm tra dữ liệu trong console log
			})
			.catch(function (error) {
				console.log("Lỗi load user", error);
			});

		$http.get('/ListFollowing')
			.then(function (response) {
				$scope.followings = response.data;
				console.log("ListFollowing1", $scope.followings); // Kiểm tra dữ liệu trong console log
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