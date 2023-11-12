
app.controller('HomeController', function ($scope, $http, $window, $rootScope, $location, $timeout) {
	$scope.Posts = [];
	$scope.likedPosts = [];
	$scope.postData = {};
	$scope.replyContent = {}; // Khởi tạo replyContent      
	$scope.notification = [];
	$scope.allNotification = [];
	$scope.violations = [];
	$scope.selectedPostId = '';
	$scope.numOfCommentsToShow = 20; // Số lượng bình luận hiển thị ban đầu
	$scope.commentsToShowMore = 10; // Số lượng bình luận hiển thị khi nhấp vào "hiển thị thêm"
	$scope.page = 0;
	$scope.followings = [];
	$scope.totalFollowing = 0;
	$scope.currentHeight = 0;
	$scope.totalPages = 0;
	var url = "http://localhost:8080";
	var getUnseenMess = "http://localhost:8080/getunseenmessage";



	// var img = new Image();
	// img.src = '/images/beach.jpg';

	// img.onload = function () {
	// 	var colorThief = new ColorThief();
	// 	var color = colorThief.getColor(img);
	// 	alert('Màu chủ đạo:' + color);
	// };



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
	$http.get(url + '/getviolations')
		.then(function (response) {
			$scope.violations = response.data;

		})
		.catch(function (error) {
			console.log(error);
		});

	$scope.loadMore = function () {
		if ($scope.page <= $scope.totalPages) {
			$http.get(url + '/get-more-posts/' + $scope.page)
				.then(function (response) {
					if (response.data && response.data.content.length > 0) {
						if ($scope.page === 0) {
							$scope.Posts = response.data.content;
						} else {
							// Nối nội dung mới vào nội dung đã có
							$scope.Posts = $scope.Posts.concat(response.data.content);
						}
						$scope.page++;
						$scope.totalPages = response.data.totalPages;
					} else {
						// Dữ liệu mới rỗng hoặc hết, bạn có thể ẩn nút "Xem thêm" ở đây nếu cần
						// Ví dụ: $scope.hasMorePosts = false;
					}

				})
				.catch(function (error) {
					console.log(error);
				});
		}

	};

	// Gọi hàm loadMore khi trang được tải lần đầu
	$scope.loadMore();

	var lastScrollTop = 0; // Biến lưu trữ vị trí cuối cùng của cuộn

	var scrollTimeout; // Biến để kiểm soát thời gian giữa các lần cuộn

	function checkScrollPosition() {
		var postDiv = document.getElementById('post');
		if (postDiv != null) {
			var postHeight = postDiv.clientHeight;
			var scrollPosition = document.documentElement.scrollTop;

			// Hủy bỏ timeout trước đó (nếu có)
			clearTimeout(scrollTimeout);

			// Thiết lập timeout mới để kiểm tra sau một khoảng thời gian nhất định
			scrollTimeout = setTimeout(function () {
				// Kiểm tra nếu cuộn xuống và scrollTop lớn hơn lastScrollTop
				if (scrollPosition > lastScrollTop) {
					// Kiểm tra nếu cuộn đến điểm mong muốn
					if (scrollPosition >= postHeight - 700) {
						$scope.loadMore();
					}
				}

				// Lưu trữ vị trí cuối cùng của cuộn
				lastScrollTop = scrollPosition;
			}, 100); // Đợi 100ms trước khi kiểm tra lại
		}
	}

	// Thêm sự kiện scroll cho thẻ body
	angular.element($window).bind('scroll', function () {
		checkScrollPosition();
	});


	// Thêm sự kiện scroll cho thẻ body
	angular.element($window).bind('scroll', function () {
		checkScrollPosition();
	});




	$http.get(url + '/findlikedposts')
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
		$http.post(url + '/report/' + postId + '/' + $scope.selectedViolationType)
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

	// Lấy số lượng tin nhắn nào chưa đọc
	$http.get(getUnseenMess)
		.then(function (response) {
			$rootScope.check = response.data > 0;
			$rootScope.unseenmess = response.data;
		})
		.catch(function (error) {
			console.log(error);
		});

	$scope.likePost = function (postId) {
		var likedIndex = $scope.likedPosts.indexOf(postId.toString());
		var likeEndpoint = url + '/likepost/' + postId;
		var dislikeEndpoint = url + '/didlikepost/' + postId;

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


	$http.get(url + '/findlikedposts')
		.then(function (response) {
			var likedPosts = response.data;
			$scope.likedPosts = likedPosts;
		})
		.catch(function (error) {
			console.log(error);
		});

	$http.get(url + '/findmyaccount')
		.then(function (response) {
			var myAccount = response.data;
			$scope.myAccount = myAccount;
		})
		.catch(function (error) {
			console.log(error);
		});

	$scope.likePost = function (postId) {
		var likedIndex = $scope.likedPosts.indexOf(postId.toString());
		var likeEndpoint = url + '/likepost/' + postId;
		var dislikeEndpoint = url + '/didlikepost/' + postId;

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
		var form = new FormData();
		var fileInput = document.getElementById('inputGroupFile01');

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

		if ($scope.content === null || $scope.content === undefined) {
			$scope.content = '';
		}

		var content = $scope.content.trim();
		form.append('content', content);
		$http.post(url + '/post', form, {
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		})
			.then(function (response) {
				var postId = response.data.postId;
				var storage = firebase.storage();
				var storageRef = storage.ref();

				var uploadNextImage = function (fileIndex) {
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
						// Xử lý lỗi tải lên
						alert("Lỗi tải");
					}, function () {
						// Tải lên thành công, lấy URL của tệp từ Firebase Storage
						uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
							var formData = new FormData();
							formData.append('imagesUrl', downloadURL);

							$http.post(url + '/postimage/' + postId, formData, {
								transformRequest: angular.identity,
								headers: {
									'Content-Type': undefined
								}
							}).then(function (response) {
								// Tiếp tục tải và gửi ảnh tiếp theo
								uploadNextImage(fileIndex + 1);
							}).catch(function (error) {
								console.error('Lỗi tải lên tệp:', error);
							});
						}).catch(function (error) {
							console.error('Error getting download URL:', error);
						});
					});
				};

				// Bắt đầu tải và gửi ảnh từ fileInput.files[0]
				uploadNextImage(0);
			})
			.catch(function (error) {
				// Xử lý lỗi
				console.log(error);
			});
	}



	// Hàm để lấy phần mở rộng từ tên tệp
	function getFileExtensionFromFileName(fileName) {
		return fileName.split('.').pop().toLowerCase();
	}

	$scope.getPostDetails = function (postId) {
		$http.get(url + '/findpostcomments/' + postId)
			.then(function (response) {
				var postComments = response.data;
				$scope.postComments = postComments;
				console.log(response.data);
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

		$http.post(url + '/addcomment/' + postId + '?myComment=' + myComment.trim())
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
		$http.get(url + '/logout')
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
		$http.post(url + '/addreply', requestData)
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
		$http.post(url + '/addreply', requestData)
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

