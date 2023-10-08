app.controller('productPostCtrl', function ($scope, $http, $translate, $rootScope, $location) {
	$scope.listPosts = [];
	$scope.listReject = [];
	$scope.Product = {};
	$scope.currentPage = 0;
	$scope.totalPages = 0;
	$scope.pageSize = 9;
	$scope.selectedCountText = 0; // Số lượng mục đã chọn

	var url = "http://localhost:8080";



	$scope.getproductList = function (currentPage) {

		$http.get(url + "/staff/postsproduct/" + currentPage)
			.then(function (res) {
				$scope.listPosts = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
				$scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi				
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	$scope.getRejectProducts = function (currentPage) {

		$http.get(url + "/staff/rejectproducts/" + currentPage)
			.then(function (res) {
				$scope.listReject = res.data.content; // Lưu danh sách sản phẩm từ phản hồi
				$scope.totalPages = res.data.totalPages; // Lấy tổng số trang từ phản hồi		
				console.log($scope.listReject);		
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	$scope.getproductList($scope.currentPage);
	$scope.getRejectProducts($scope.currentPage);

	// $http.get(url + '/staff/postsproduct').then(function (response) {
	// 	// Gán dữ liệu từ API vào biến $scope.listViolations
	// 	$scope.listPosts = response.data;
	// 	console.log($scope.listPosts.content);
	// }).catch(function (error) {
	// 	console.error('Lỗi khi lấy dữ liệu bài đăng sản phẩm:', error);
	// });


	//Hàm để cập nhật dữ liệu từ API và số trang khi chuyển đến trang mới
	function loadViolationsData(page) {
		$http.get(url + '/staff/postsproduct', { params: { page: page, size: $scope.pageSize } })
			.then(function (response) {
				$scope.listPosts = response.data;
				updatePagination();
			})
			.catch(function (error) {
				console.error('Lỗi khi lấy dữ liệu bài viết vi phạm:', error);
			});
	}

	// Hàm để cập nhật số trang dựa vào số lượng bài viết vi phạm
	function calculateTotalPages() {
		$scope.totalPages = $scope.listPosts.totalPages;
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

	$scope.searchProduct = function () {
		var name = $scope.searchText;
		name = name.trim();
		if (!name) {
			// Nếu ô tìm kiếm rỗng, gán lại giá trị ban đầu cho biến $scope.listViolations.content
			$scope.listPosts.content;
			return;
		}
		$http.get(url + '/staff/searchProduct', { params: { name: name } })
			.then(function (response) {
				// Xử lý kết quả tìm kiếm ở đây
				console.log(response.data);
				$scope.listPosts.content = response.data;
			})
			.catch(function (error) {
				console.error('Lỗi khi tìm kiếm bài viết:', error);
			});
	};

	$scope.detailProduct = function (productId) {
		// Gọi API để lấy thông tin chi tiết bài viết dựa vào postId
		$http.get(url + '/staff/postsproduct/detailProduct/' + productId)
			.then(function (response) {
				$scope.product = response.data;
				console.log($scope.product);
				$('#exampleModal').modal('show'); // Hiển thị modal khi có dữ liệu bài viết
			})
			.catch(function (error) {
				console.error('Lỗi khi lấy thông tin chi tiết bài viết:', error);
			});
	};




	$scope.getSalePrice = function (originalPrice, promotion) {
		if (promotion === 0) {
			return originalPrice;
		} else {
			//tính tổng số lượng các đánh giá
			var SalePrice = originalPrice - (originalPrice * promotion / 100);
			return SalePrice;
		}
	}

	$scope.accept = function (productId) {

		Swal.fire({
			text: 'Bạn có chắc muốn chấp nhận sản phẩm này không?',
			icon: 'warning',
			confirmButtonText: 'Có, chắc chắn',
			showCancelButton: true,
			confirmButtonColor: '#159b59',
			cancelButtonColor: '#d33'
		}).then((result) => {
			if (result.isConfirmed) {
				$http({
					method: 'POST',
					url: url + '/staff/postsproduct/accept/' + productId
				}).then(function (response) {
					// Cập nhật dữ liệu mới nhận được từ server
					$scope.listPosts = response.data;
					$scope.reloadPage();
				}).catch(function (error) {
					console.error('Lỗi khi chấp nhận yêu cầu các bài viết:', error);

					Swal.fire({
						position: 'top',
						icon: 'error',
						text: 'Không chấp nhận yêu cầu được!',
						showConfirmButton: false,
						timer: 1800
					});
				});
			}
		});
	};

	$scope.rejectPage = function () {
		$('#reasonModal').modal('show');
		$('#exampleModal').modal('hide');



		$('#reasonModal').on('hidden.bs.modal', function () {
			$('#exampleModal').modal('show');
		});
	}

	$scope.reject = function (productId) {
		// Lấy lý do từ chối từ input field. Giả sử input field có id là 'reason'
		var reason = $scope.reasonRejection;
		if(!reason){
			Swal.fire(
				'Lỗi!',
				'Vui lòng nhập vào lí do từ chối!',
				'error'
			)
		}else{
			$http({
				method: 'POST',
				url: url + '/staff/rejectproduct/reject/' + productId,
				data: {
					reason: reason,
					productId: productId
				}
			}).then(function (response) {
				if(response.status === 400){
					Swal.fire(
						'Không được bỏ trống lý do!',
						response.data,
						'error'
					)
				} else {
					$scope.Product = response.data;
					Swal.fire({
						title: 'Thành công!',
						text: 'Đã từ chối bài đăng sản phẩm này!',
						icon: 'success',
						showCancelButton: false,
						confirmButtonText: 'OK'
					}).then((result) => {
						// Check if the user clicked the "OK" button
						if (result.isConfirmed) {
							$scope.reloadPage();
						}
					});
				}
			});
		}
	}
	
	
	$scope.reloadPage = function () {
		location.reload();
	}

})