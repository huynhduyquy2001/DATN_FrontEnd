app.controller('productsViolationCtrl', function ($scope, $http, $translate, $rootScope, $location) {
	$scope.listProducts = [];
	$scope.listViolationProducts = [];
	$scope.listViolationProduct = [];
	$scope.listProduct = [];
	$scope.listDescription = [];
	$scope.Product = {};
	$scope.violation = 0;
	$scope.currentPage = 0;
	$scope.totalPages = 0;
	$scope.pageSize = 9;
	$scope.selectedCountText = 0; // Số lượng mục đã chọn

	var url = "https://viesonetapi2.azurewebsites.net";

	$scope.getproductList = function (currentPage) {

		$http.get(url + "/staff/violationsproduct/" + currentPage)
			.then(function (res) {
				var products = res.data.content; // Lấy danh sách sản phẩm từ phản hồi

				// Sử dụng một đối tượng để theo dõi các sản phẩm đã xuất hiện
				var uniqueProductMap = {};

				// Tạo danh sách sản phẩm đã gom lại
				var groupedProducts = [];

				products.forEach(function (product) {
					if (!uniqueProductMap[product.product.productId]) {
						uniqueProductMap[product.product.productId] = true;
						groupedProducts.push(product);
					}
				});

				$scope.listProducts = groupedProducts;
				$scope.listProduct = groupedProducts;
				$scope.totalPages = res.data.totalPages;
				console.log($scope.listProducts);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	$scope.getproductViolationList = function (currentPage) {

		$http.get(url + "/staff/alreadyviolationsproduct/" + currentPage)
			.then(function (res) {
				var products = res.data.content; // Lấy danh sách sản phẩm từ phản hồi

				// Sử dụng một đối tượng để theo dõi các sản phẩm đã xuất hiện
				var uniqueProductMap = {};

				// Tạo danh sách sản phẩm đã gom lại
				var groupedProducts = [];

				products.forEach(function (product) {
					if (!uniqueProductMap[product.product.productId]) {
						uniqueProductMap[product.product.productId] = true;
						groupedProducts.push(product);
					}
				});

				$scope.listViolationProducts = groupedProducts;
				$scope.listViolationProduct = groupedProducts;
				$scope.totalPages = res.data.totalPages;
				console.log($scope.listProducts);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	$scope.getDescriptionList = function (productId) {

		$http.get(url + "/staff/violationsproduct/listDescription/" + productId)
			.then(function (res) {
				$scope.listDescription = res.data;

			})
			.catch(function (error) {
				console.log(error);
			});
	}

	$scope.getCountViolation = function (productId) {
		$http.get(url + "/staff/violationsproduct/countViolations/" + productId)
			.then(function (res) {
				$scope.violation = res.data;

			})
			.catch(function (error) {
				console.log(error);
			});
	}



	$scope.getproductList($scope.currentPage);
	$scope.getproductViolationList($scope.currentPage);


	//Hàm để cập nhật dữ liệu từ API và số trang khi chuyển đến trang mới
	function loadViolationsData(page) {
		$http.get(url + '/staff/violationsproduct/', { params: { page: page, size: $scope.pageSize } })
			.then(function (response) {
				$scope.listProducts = response.data;
				updatePagination();
			})
			.catch(function (error) {
				console.error('Lỗi khi lấy dữ liệu bài viết vi phạm:', error);
			});
	}

	// Hàm để cập nhật số trang dựa vào số lượng bài viết vi phạm
	function calculateTotalPages() {
		$scope.totalPages = $scope.listProducts.totalPages;
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

	// Hàm để tạo mảng các trang cụ thể
	$scope.getPagesArray = function () {
		return Array.from({ length: $scope.totalPages }, (_, i) => i);
	};

	$scope.searchProduct = function () {
		var name = $scope.searchText;
		name = name.trim();

		$scope.listProducts = $scope.listProduct;
		if (!name) {
			// Nếu ô tìm kiếm rỗng, sử dụng danh sách sản phẩm ban đầu
			$scope.listProducts;
			return;

		}
		$http.get(url + '/staff/searchViolationProduct', { params: { name: name } })
			.then(function (response) {
				var products = response.data; // Lấy danh sách sản phẩm từ phản hồi

				// Sử dụng một đối tượng để theo dõi các sản phẩm đã xuất hiện
				var uniqueProductMap = {};

				// Tạo danh sách sản phẩm đã gom lại
				var groupedProducts = [];

				products.forEach(function (product) {
					if (!uniqueProductMap[product.product.productId]) {
						uniqueProductMap[product.product.productId] = true;
						groupedProducts.push(product);
					}
				});

				$scope.listProducts = groupedProducts;
			})
			.catch(function (error) {
				console.error('Lỗi khi tìm kiếm bài viết:', error);
			});
	};

	$scope.searchProductViolation = function () {
		var name = $scope.searchViolationText;
		name = name.trim();

		$scope.listViolationProducts = $scope.listViolationProduct;
		if (!name) {
			// Nếu ô tìm kiếm rỗng, sử dụng danh sách sản phẩm ban đầu
			$scope.listViolationProducts;
			return;

		}
		$http.get(url + '/staff/searchAlreadyViolationProduct', { params: { name: name } })
			.then(function (response) {
				var products = response.data; // Lấy danh sách sản phẩm từ phản hồi

				// Sử dụng một đối tượng để theo dõi các sản phẩm đã xuất hiện
				var uniqueProductMap = {};

				// Tạo danh sách sản phẩm đã gom lại
				var groupedProducts = [];

				products.forEach(function (product) {
					if (!uniqueProductMap[product.product.productId]) {
						uniqueProductMap[product.product.productId] = true;
						groupedProducts.push(product);
					}
				});

				$scope.listViolationProducts = groupedProducts;
			})
			.catch(function (error) {
				console.error('Lỗi khi tìm kiếm bài viết:', error);
			});
	};

	$scope.detailProduct = function (violationId) {
		// Gọi API để lấy thông tin chi tiết bài viết dựa vào postId
		$http.get(url + '/staff/violationsproduct/detailProduct/' + violationId)
			.then(function (response) {
				$scope.product = response.data;
				$scope.getDescriptionList(response.data.product.productId);
				$scope.getCountViolation(response.data.product.productId)
				$('#exampleModal').modal('show');

			})
			.catch(function (error) {
				console.error('Lỗi khi lấy thông tin chi tiết bài viết:', error);
			});
	};

	$scope.detailViolation = function (violationId) {
		// Gọi API để lấy thông tin chi tiết bài viết dựa vào postId
		$http.get(url + '/staff/violationsproduct/detailProduct/' + violationId)
			.then(function (response) {
				$scope.product = response.data;
				$scope.getDescriptionList(response.data.product.productId);
				$('#reasonModal').modal('show');

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

	$scope.accept = function (violationId) {
		// Trước khi gọi API accept, thực hiện truy vấn để lấy productId dựa trên violationId
		$http({
			method: 'GET',
			url: url + '/staff/violationsproduct/getProductId/' + violationId
		}).then(function (response) {

			Swal.fire({
				text: 'Bạn có chắc muốn chấp nhận tố cáo sản phẩm này không?',
				icon: 'warning',
				confirmButtonText: 'Có, chắc chắn',
				showCancelButton: true,
				confirmButtonColor: '#159b59',
				cancelButtonColor: '#d33'
			}).then((result) => {
				if (result.isConfirmed) {
					// Gọi API accept với productId
					$http({
						method: 'POST',
						url: url + '/staff/violationsproduct/accept/' + response.data
					}).then(function (acceptResponse) {
						// Xử lý phản hồi sau khi chấp nhận

						Swal.fire({
							title: 'Thành công!',
							text: 'Đã xử lý bài đăng sản phẩm này!',
							icon: 'success',
							showCancelButton: false,
							confirmButtonText: 'OK'
						}).then((result) => {
							// Check if the user clicked the "OK" button
							if (result.isConfirmed) {
								// Loại bỏ sản phẩm có violationId khỏi danh sách listProducts
								$scope.listProducts = $scope.listProducts.filter(function (product) {
									return product.violationId !== violationId;
								});
								$scope.reloadPage();
							}
						});
					}).catch(function (acceptError) {
						console.error('Lỗi khi chấp nhận yêu cầu các bài viết:', acceptError);
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
		}).catch(function (error) {
			console.error('Lỗi khi lấy productId:', error);
			// Xử lý lỗi khi lấy productId
		});
	};




	$scope.reject = function (violationId) {
		$http({
			method: 'GET',
			url: url + '/staff/violationsproduct/getProductId/' + violationId
		}).then(function (response) {
			$http({
				method: 'POST',
				url: url + '/staff/violationsproduct/delete/' + response.data,
			}).then(function (res) {
				Swal.fire({
					title: 'Thành công!',
					text: 'Đã từ chối bài đăng sản phẩm này!',
					icon: 'success',
					showCancelButton: false,
					confirmButtonText: 'OK'
				}).then((result) => {
					// Check if the user clicked the "OK" button
					if (result.isConfirmed) {
						$scope.listProducts = $scope.listProducts.filter(function (product) {
							return product.violationId !== violationId;
						});
						$scope.reloadPage();
					}
				});

			});
		}).catch(function (error) {
			console.error('Lỗi khi lấy productId:', error);
			// Xử lý lỗi khi lấy productId
		});

	}


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
	checkScreenWidth();
})