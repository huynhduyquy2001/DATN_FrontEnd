app.controller('PvmCtrl', function ($scope, $http, $translate, $rootScope, $location) {
	$scope.listViolations = [];
	$scope.listViolation = [];
	$scope.post = {};
	$scope.currentPage = 0;
	$scope.totalPages = 0;
	$scope.pageSize = 9;
	$scope.selectedCountText = 0; // Số lượng mục đã chọn

	var url = "http://localhost:8080";

	$http.get(url + '/staff/postsviolations/load').then(function (response) {
		// Gán dữ liệu từ API vào biến $scope.listViolations
		$scope.listViolations = response.data;
	}).catch(function (error) {
		console.error('Lỗi khi lấy dữ liệu bài viết vi phạm:', error);
	});

	//Hàm tải dữ liệu ban đầu
	function loadInitialData() {
		$http.get(url + '/staff/postsviolations/load')
			.then(function (response) {
				// Lưu trữ danh sách gốc vào biến originalList
				originalList = response.data.content;
				// Gán danh sách cho biến $scope.listViolations để hiển thị
				$scope.listViolations = response.data;
			})
			.catch(function (error) {
				console.error('Lỗi khi tải dữ liệu:', error);
			});
	}

	// Gọi hàm tải dữ liệu ban đầu khi trang được tải lần đầu
	loadInitialData();

	$scope.searchByAuthor = function () {
		var username = $scope.searchText;
		username = username.trim();
		if (!username) {
			// Nếu ô tìm kiếm rỗng, gán lại giá trị ban đầu cho biến $scope.listViolations.content
			$scope.listViolations.content = originalList;
			return;
		}
		$http.get(url + '/staff/searchUserViolation', { params: { username: username } })
			.then(function (response) {
				// Xử lý kết quả tìm kiếm ở đây
				console.log(response.data);
				$scope.listViolations.content = response.data;
			})
			.catch(function (error) {
				console.error('Lỗi khi tìm kiếm bài viết:', error);
			});
	};


	//Hàm để cập nhật dữ liệu từ API và số trang khi chuyển đến trang mới
	function loadViolationsData(page) {
		$http.get(url + '/staff/postsviolations/load', { params: { page: page, size: $scope.pageSize } })
			.then(function (response) {
				$scope.listViolations = response.data;
				updatePagination();
			})
			.catch(function (error) {
				console.error('Lỗi khi lấy dữ liệu bài viết vi phạm:', error);
			});
	}

	// Hàm để cập nhật số trang dựa vào số lượng bài viết vi phạm
	function calculateTotalPages() {
		$scope.totalPages = $scope.listViolations.totalPages;
	}


	// Hàm để chuyển đến trang trước
	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
			loadViolationsData($scope.currentPage);
		}
	};

	// Hàm để chuyển đến trang kế tiếp
	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.totalPages - 1) {
			$scope.currentPage++;
			loadViolationsData($scope.currentPage);
		}
	};

	// Hàm để cập nhật số trang khi dữ liệu thay đổi
	function updatePagination() {
		calculateTotalPages();
		// Đảm bảo rằng trang hiện tại không vượt quá tổng số trang
		$scope.currentPage = Math.min($scope.currentPage, $scope.totalPages - 1);
	}

	// Gọi hàm để cập nhật dữ liệu từ API khi controller khởi tạo
	loadViolationsData($scope.currentPage);

	// Hàm để tạo mảng các trang cụ thể
	$scope.getPagesArray = function () {
		return Array.from({ length: $scope.totalPages }, (_, i) => i);
	};


	// Hàm xem chi tiết bài viết
	$scope.detailPost = function (postId) {
		// Gọi API để lấy thông tin chi tiết bài viết dựa vào postId
		$http.get(url + '/staff/postsviolations/detailPost/' + postId)
			.then(function (response) {
				$scope.post = response.data;
				console.log($scope.post);
				$('#exampleModal').modal('show'); // Hiển thị modal khi có dữ liệu bài viết
			})
			.catch(function (error) {
				console.error('Lỗi khi lấy thông tin chi tiết bài viết:', error);
			});
		$http.get(url + '/staff/postsviolations/detailViolation/' + postId)
			.then(function (response) {
				$scope.listViolation = response.data;
			})
			.catch(function (error) {
				console.error('Lỗi khi lấy thông tin chi tiết vi phạm:', error);
			});
	};

	//Xử lý các checkbox
	$scope.selectAll = function () {
		var isChecked = $scope.selectAllCheckbox;
		angular.forEach($scope.listViolations.content, function (violation) {
			violation.checked = !isChecked;
		});
		$scope.updateSelectedCount();
	};

	$scope.updateSelectedCount = function () {
		var selectedCount = $scope.listViolations.content.filter(function (violation) {
			return violation.isVisible && violation.checked; // Chỉ đếm các checkbox được chọn trong các dòng không ẩn
		}).length;
		$scope.selectedCountText = selectedCount;
	};


	$scope.checkboxClicked = function () {
		var allChecked = true;
		angular.forEach($scope.listViolations.content, function (violation) {
			if (!violation.checked) {
				allChecked = false;
			}
		});
		$scope.selectAllCheckbox = allChecked;
		$scope.updateSelectedCount();
	};

	// Hàm để xóa các mục đã chọn
	$scope.deletePostViolations = function () {
		// Lấy danh sách các postId được chọn
		var listPostId = $scope.listViolations.content
			.filter(item => item.checked)
			.map(item => item[0]);

		if (listPostId.length === 0) {
			Swal.fire({
				position: 'top',
				icon: 'warning',
				text: 'Chưa chọn bài viết vi phạm để xóa!',
				showConfirmButton: false,
				timer: 1800
			});
		} else {
			Swal.fire({
				text: 'Bạn có chắc muốn xóa bài viết vi phạm không?',
				icon: 'warning',
				confirmButtonText: 'Có, chắc chắn',
				showCancelButton: true,
				confirmButtonColor: '#159b59',
				cancelButtonColor: '#d33'
			}).then((result) => {
				if (result.isConfirmed) {
					$http({
						method: 'POST',
						url: url + '/staff/postsviolations/delete',
						data: JSON.stringify(listPostId),
						contentType: 'application/json'
					}).then(function (response) {
						// Cập nhật dữ liệu mới nhận được từ server
						$scope.listViolations = response.data;
						// Reset số lượng mục đã chọn về 0
						$scope.selectedCountText = 0;

						Swal.fire({
							position: 'top',
							icon: 'success',
							text: 'Xóa bài viết vi phạm thành công!',
							showConfirmButton: false,
							timer: 1800
						});
					}).catch(function (error) {
						console.error('Lỗi khi xóa các bài viết:', error);

						Swal.fire({
							position: 'top',
							icon: 'error',
							text: 'Không xóa được bài viết vi phạm!',
							showConfirmButton: false,
							timer: 1800
						});
					});
				}
			});
		}
	};

	$scope.acceptPostViolations = function () {
		// Lấy danh sách các postId được chọn
		var listPostId = $scope.listViolations.content
			.filter(item => item.checked)
			.map(item => item[0]);

		if (listPostId.length === 0) {
			Swal.fire({
				position: 'top',
				icon: 'warning',
				text: 'Chưa chọn bài viết vi phạm để chấp nhận yêu cầu!',
				showConfirmButton: false,
				timer: 1800
			});
		} else {
			Swal.fire({
				text: 'Bạn có chắc muốn chấp nhận tố cáo bài viết vi phạm không?',
				icon: 'warning',
				confirmButtonText: 'Có, chắc chắn',
				showCancelButton: true,
				confirmButtonColor: '#159b59',
				cancelButtonColor: '#d33'
			}).then((result) => {
				if (result.isConfirmed) {
					$http({
						method: 'POST',
						url: url + '/staff/postsviolations/accept',
						data: JSON.stringify(listPostId),
						contentType: 'application/json'
					}).then(function (response) {
						// Cập nhật dữ liệu mới nhận được từ server
						$scope.listViolations = response.data;
						// Reset số lượng mục đã chọn về 0
						$scope.selectedCountText = 0;

						Swal.fire({
							position: 'top',
							icon: 'success',
							text: 'Chấp nhận yêu cầu bài viết vi phạm thành công!',
							showConfirmButton: false,
							timer: 1800
						});
					}).catch(function (error) {
						console.error('Lỗi khi chấp nhận yêu cầu các bài viết:', error);

						Swal.fire({
							position: 'top',
							icon: 'error',
							text: 'Không chấp nhận yêu cầu được bài viết vi phạm!',
							showConfirmButton: false,
							timer: 1800
						});
					});
				}
			});
		}
	};

	$scope.reloadPage = function () {
		location.reload();
	}
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
	setTimeout(function () {
		checkScreenWidth();
	  }, 100);
});