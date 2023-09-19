

app.controller('HomeController', function ($scope, $http, $translate, $window, $rootScope, $location) {

	$scope.Posts = [];
	$scope.likedPosts = [];
	$scope.postData = {};
	$scope.replyContent = {}; // Khởi tạo replyContent      
	$rootScope.check = false;
	$scope.unseenmess = 0;
	$scope.notification = [];
	$scope.allNotification = [];
	$scope.violations = [];
	$scope.selectedPostId = '';
	$scope.numOfCommentsToShow = 20; // Số lượng bình luận hiển thị ban đầu
	$scope.commentsToShowMore = 10; // Số lượng bình luận hiển thị khi nhấp vào "hiển thị thêm"
	$scope.page = 0;
	$scope.followings = [];
	$scope.totalFollowing = 0;
	var url = "http://localhost:8080";
	$scope.changeLanguage = function (langKey) {
		$translate.use(langKey);
		localStorage.setItem('myAppLangKey', langKey); // Lưu ngôn ngữ đã chọn vào localStorage
	};
	// Hàm để tăng số lượng bình luận hiển thị khi nhấp vào "hiển thị thêm"
	$scope.showMoreComments = function () {
		$scope.numOfCommentsToShow += $scope.commentsToShowMore;
	};

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

	//lấy danh sách người theo dõi
	$scope.findFollowings = function () {
		$http.get(url + "/findfollowing")
			.then(function (response) {
				$scope.followings = response.data;
			})
	}
	$scope.findFollowings();
	//Lấy danh sách vi phạm
	$http.get('http://localhost:8080/getviolations')
		.then(function (response) {
			$scope.violations = response.data;

		})
		.catch(function (error) {
			console.log(error);
		});

	$scope.loadMore = function () {
		$http.get('http://localhost:8080/get-more-posts/' + $scope.page)
			.then(function (response) {
				if ($scope.page === 0) {
					$scope.Posts = response.data.content;
				} else if ($scope.page > 0) {
					// Nối nội dung mới vào nội dung đã có
					$scope.Posts = $scope.Posts.concat(response.data.content);
				}
				$scope.page = $scope.page + 1;
			})
			.catch(function (error) {
				console.log(error);
			});
	};


	// Gọi hàm loadMore khi trang được tải lần đầu
	$scope.loadMore();


	$http.get('http://localhost:8080/findlikedposts')
		.then(function (response) {
			var likedPosts = response.data;
			$scope.likedPosts = likedPosts;
		})
		.catch(function (error) {
			console.log(error);
		});



	$scope.openModalBaoCao = function (postId) {
		$scope.selectedPostId = postId;
		$('#modalBaoCao').modal('show');
	};

	$scope.report = function (postId) {
		if ($scope.selectedViolationType === null || $scope.selectedViolationType === undefined) {
			const Toast = Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1000,
				timerProgressBar: true,
				didOpen: (toast) => {
					toast.addEventListener('mouseenter', Swal.stopTimer)
					toast.addEventListener('mouseleave', Swal.resumeTimer)
				}
			})
			Toast.fire({
				icon: 'warning',
				title: 'Bạn phải chọn nội dung báo cáo'
			})
			return;
		}
		$http.post('http://localhost:8080/report/' + postId + '/' + $scope.selectedViolationType)
			.then(function (response) {
				const Toast = Swal.mixin({
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 1000,
					timerProgressBar: true,
					didOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer)
						toast.addEventListener('mouseleave', Swal.resumeTimer)
					}
				})
				Toast.fire({
					icon: 'success',
					title: 'Báo cáo bài viết thành công'
				})
			})
			.catch(function (error) {
				// Xử lý lỗi
				console.log(error);
			});
		$('#modalBaoCao').modal('hide');
	};


	$scope.likePost = function (postId) {
		var likedIndex = $scope.likedPosts.indexOf(postId.toString());
		var likeEndpoint = 'http://localhost:8080/likepost/' + postId;
		var dislikeEndpoint = 'http://localhost:8080/didlikepost/' + postId;

		// Nếu postId chưa tồn tại trong mảng likedPosts
		if (likedIndex === -1) {
			// Thêm postId vào mảng likedPosts
			$scope.likedPosts.push(postId.toString());

			// Gửi yêu cầu POST để like bài viết và cập nhật likeCount+1
			$http.post(likeEndpoint)
				.then(function (response) {

					// Cập nhật thuộc tính likeCount+1 trong đối tượng post
					var post = $scope.Posts.find(function (item) {
						return item.postId === postId;
					});
					if (post) {
						post.likeCount++;

					}
				})
				.catch(function (error) {
					// Xử lý lỗi
					console.log(error);
				}); imagesurlform
		} else {

			// Xóa postId khỏi mảng likedPosts
			$scope.likedPosts.splice(likedIndex, 1);

			// Gửi yêu cầu POST để dislike bài viết và cập nhật likeCount-1
			$http.post(dislikeEndpoint)
				.then(function (response) {
					// Xử lý thành công
					//console.log(response.data);

					// Cập nhật thuộc tính likeCount-1 trong đối tượng post
					var post = $scope.Posts.find(function (item) {
						return item.postId === postId;
					});
					if (post) {
						post.likeCount--;

					}
				})
				.catch(function (error) {
					// Xử lý lỗi
					console.log(error);
				});
		}
	};

	$scope.getPostDetails = function (postId) {
		$http.get('http://localhost:8080/findpostcomments/' + postId)
			.then(function (response) {
				var count = response.data;
				if (count > 0) {
					$scope.check = true;
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	$http.get('http://localhost:8080/findlikedposts')
		.then(function (response) {
			var likedPosts = response.data;
			$scope.likedPosts = likedPosts;
		})
		.catch(function (error) {
			console.log(error);
		});

	$http.get('http://localhost:8080/findmyaccount')
		.then(function (response) {
			var myAccount = response.data;
			$scope.myAccount = myAccount;
		})
		.catch(function (error) {
			console.log(error);
		});

	$scope.likePost = function (postId) {
		var likedIndex = $scope.likedPosts.indexOf(postId.toString());
		var likeEndpoint = 'http://localhost:8080/likepost/' + postId;
		var dislikeEndpoint = 'http://localhost:8080/didlikepost/' + postId;

		// Nếu postId chưa tồn tại trong mảng likedPosts
		if (likedIndex === -1) {
			// Thêm postId vào mảng likedPosts
			$scope.likedPosts.push(postId.toString());

			// Gửi yêu cầu POST để like bài viết và cập nhật likeCount+1
			$http.post(likeEndpoint)
				.then(function (response) {

					// Cập nhật thuộc tính likeCount+1 trong đối tượng post
					var post = $scope.Posts.find(function (item) {
						return item.postId === postId;
					});
					if (post) {
						post.likeCount++;

					}
				})
				.catch(function (error) {
					// Xử lý lỗi
					console.log(error);
				});
		} else {

			// Xóa postId khỏi mảng likedPosts
			$scope.likedPosts.splice(likedIndex, 1);

			// Gửi yêu cầu POST để dislike bài viết và cập nhật likeCount-1
			$http.post(dislikeEndpoint)
				.then(function (response) {
					// Xử lý thành công
					//console.log(response.data);

					// Cập nhật thuộc tính likeCount-1 trong đối tượng post
					var post = $scope.Posts.find(function (item) {
						return item.postId === postId;
					});
					if (post) {
						post.likeCount--;

					}
				})
				.catch(function (error) {
					// Xử lý lỗi
					console.log(error);
				});
		}
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

	//đăng bài
	$scope.post = function () {
		var formData = new FormData();
		var fileInput = document.getElementById('inputGroupFile01');
		// Check if no files are selected
		if (fileInput.files.length === 0) {
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
			})

			Toast.fire({
				icon: 'warning',
				title: 'Bạn phải thêm ảnh vào bài viết'
			})
			return; // Return without doing anything
		}
		for (var i = 0; i < fileInput.files.length; i++) {
			var file = fileInput.files[i];
			var fileSizeMB = file.size / (1024 * 1024); // Kích thước tệp tin tính bằng megabyte (MB)

			if (fileSizeMB > 1000) {
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
					title: 'Kích thước tệp tin quá lớn (giới hạn 1GB)'
				});

				return; // Return without doing anything
			}

		}

		var storage = firebase.storage();
		var storageRef = storage.ref();
		var imagesUrl = [];

		if ($scope.content === null || $scope.content === undefined) {
			$scope.content = '';
		}

		var fileCount = fileInput.files.length;
		var uploadCount = 0;

		for (var i = 0; i < fileCount; i++) {
			var file = fileInput.files[i];
			var fileSizeMB = file.size / (1024 * 1024);

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
					imagesUrl.push(downloadURL);
					uploadCount++;

					if (uploadCount === fileCount) {
						// Khi đã tải lên tất cả các tệp, gửi yêu cầu POST
						formData.append('content', $scope.content.trim());
						formData.append('imagesUrl', imagesUrl);

						$http.post(url + '/post', formData, {
							transformRequest: angular.identity,
							headers: {
								'Content-Type': undefined
							}
						}).then(function (response) {
							// Xử lý phản hồi thành công từ máy chủ
						}, function (error) {
							// Xử lý lỗi
							console.log(error);
						});
					}
				}).catch(function (error) {
					console.error('Error getting download URL:', error);
				});
			});
		}

		$scope.content = '';
		fileInput.value = null;
		var mediaList = document.getElementById('mediaList');
		mediaList.innerHTML = '';
		$window.selectedMedia = [];
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
		})

		Toast.fire({
			icon: 'success',
			title: 'Bài viết được đăng thành công'
		})
	};

	// Hàm để lấy phần mở rộng từ tên tệp
	function getFileExtensionFromFileName(fileName) {
		return fileName.split('.').pop().toLowerCase();
	}

	$scope.getPostDetails = function (postId) {
		$http.get('http://localhost:8080/findpostcomments/' + postId)
			.then(function (response) {
				var postComments = response.data;
				$rootScope.postComments = postComments;
				console.log(response.data);
			}, function (error) {
				// Xử lý lỗi
				console.log(error);
			});

		$scope.isReplyEmpty = true;
		$http.get('http://localhost:8080/postdetails/' + postId)
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


	$scope.addComment = function (postId) {
		var myComment = $scope.myComment;

		if (myComment === undefined || myComment.trim() === '') {
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
			})

			Toast.fire({
				icon: 'warning',
				title: 'Bạn chưa nhập nội dung bình luận'
			})
			return;
		}

		$http.post('http://localhost:8080/addcomment/' + postId + '?myComment=' + myComment.trim())
			.then(function (response) {
				$scope.postComments.unshift(response.data);
				var postToUpdate = $scope.Posts.find(function (post) {
					return post.postId === postId; // Sửa thành '===' thay vì '='
				});
				if (postToUpdate) {
					postToUpdate.commentCount++;
				}

			}, function (error) {
				console.log(error);
			});

		$scope.myComment = '';

	};



	$scope.logout = function () {
		$http.get('http://localhost:8080/logout')
			.then(function () {
				window.location.href = '/login';
			}, function (error) {
				console.log(error);
			});
	};




	$scope.sendReply = function (receiverId, replyContent, replyId, commentId) {
		var requestData = {
			receiverId: receiverId,
			replyContent: replyContent,
			commentId: commentId,
			postId: $scope.postDetails.postId
		};
		if (replyContent === null || replyContent === undefined || replyContent.trim() === '') {
			const Toast = Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1000,
				timerProgressBar: true,
				didOpen: (toast) => {
					toast.addEventListener('mouseenter', Swal.stopTimer)
					toast.addEventListener('mouseleave', Swal.resumeTimer)
				}
			})
			Toast.fire({
				icon: 'warning',
				title: 'Bạn phải nhập nội dung phản hồi'
			})
			return;
		}
		var postToUpdate = $scope.Posts.find(function (post) {
			return post.postId = $scope.postDetails.postId;
		});
		if (postToUpdate) {
			postToUpdate.commentCount++;
		}
		$http.post('/addreply', requestData)
			.then(function (response) {
				var comment = $scope.postComments.find(function (comment) {
					return comment.commentId === commentId;
				});
				comment.reply.unshift(response.data);
				$scope.replyContent[replyId] = '';
			})
			.catch(function (error) {
				// Xử lý lỗi
				console.log('Lỗi:', error);
			});

	};



	$scope.sendReplyForComment = function (receiverId, commentId, replyContent) {

		var requestData = {
			receiverId: receiverId,
			replyContent: replyContent,
			commentId: commentId,
			postId: $scope.postDetails.postId
		};
		if (replyContent === null || replyContent === undefined || replyContent.trim() === '') {
			// Code xử lý thông báo khi nội dung phản hồi trống
			return;
		}
		$http.post('/addreply', requestData)
			.then(function (response) {

				try {
					var comment = $scope.postComments.find(function (comment) {
						return comment.commentId == commentId;
					});
					$scope.replyContent[comment.commentId] = '';
					try {
						comment.reply.push(response.data);
					} catch (error) {
						console.log('Lỗi khi thêm phản hồi:', error);
					}

					// Thêm cập nhật giao diện tại đây (nếu cần)

					var postToUpdate = $scope.Posts.find(function (post) {
						return post.postId === $scope.postDetails.postId;
					});
					if (postToUpdate) {
						postToUpdate.commentCount++;
					}
				} catch (error) {
					console.log('Lỗi khi thêm phản hồi:', error);
				}
			})
			.catch(function (error) {
				// Xử lý lỗi
				console.log('Lỗi:', error);
			});
	};


	$scope.handleKeyDown = function (event, userId, replyContent, replyId, commentId) {
		if (event.keyCode === 13) {
			// Người dùng đã nhấn phím Enter
			$scope.sendReply(userId, replyContent, replyId, commentId);
		}
	};

	$scope.handleKeyDownReplyForComment = function (event, receiverId, commentId, replyContent) {
		if (event.keyCode === 13) {
			// Người dùng đã nhấn phím Enter
			$scope.sendReplyForComment(receiverId, commentId, replyContent);
		}
	};

});

