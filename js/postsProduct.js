app.controller('productPostCtrl', function ($scope, $http, $translate, $rootScope, $location) {
    $scope.listPosts = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pageSize = 9;
    $scope.selectedCountText = 0; // Số lượng mục đã chọn

    var url = "http://localhost:8080";

    $http.get(url + '/staff/postsproduct').then(function (response) {
        // Gán dữ liệu từ API vào biến $scope.listViolations
        $scope.listPosts = response.data;
        console.log($scope.listPosts.content);
    }).catch(function (error) {
        console.error('Lỗi khi lấy dữ liệu bài đăng sản phẩm:', error);
    });


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

        //Xử lý các checkbox
		$scope.selectAll = function () {
			var isChecked = $scope.selectAllCheckbox;
			angular.forEach($scope.listPosts.content, function (violation) {
				violation.checked = !isChecked;
			});
			$scope.updateSelectedCount();
		};

		$scope.updateSelectedCount = function () {
			var selectedCount = $scope.listPosts.content.filter(function (violation) {
				return violation.isVisible && violation.checked; // Chỉ đếm các checkbox được chọn trong các dòng không ẩn
			}).length;
			$scope.selectedCountText = selectedCount;
		};


		$scope.checkboxClicked = function () {
			var allChecked = true;
			angular.forEach($scope.listPosts.content, function (violation) {
				if (!violation.checked) {
					allChecked = false;
				}
			});
			$scope.selectAllCheckbox = allChecked;
			$scope.updateSelectedCount();
		};

        

})