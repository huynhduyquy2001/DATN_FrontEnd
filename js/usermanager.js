app.controller(
	"UserManagerController",
	function ($scope, $http, $translate, $rootScope, $location) {
		$scope.listUsers = [];
		$scope.profile = [];
		var url = "https://viesonetapi2.azurewebsites.net"
		$http.get(url + '/admin/usermanager/load')
			.then(function (response) {
				$scope.listUsers = response.data;
				originalList = response.data;
			});

		$http.get(url + '/admin/usermanager/profile')
			.then(function (response) {
				$scope.profile = response.data;
			});

		$scope.detailUser = function (userId) {

			$http.get(url + '/admin/usermanager/detailUser/' + userId)
				.then(function (response) {
					$scope.profile = response.data;
				});
		}

		$scope.searchUser = function () {
			var search = $scope.searchValue;
			if ($scope.searchValue === '') {
				$scope.listUsers = originalList;
				return;
			} else {
				$http.get(url + "/admin/usermanager/search/" + search)
					.then(function (response) {
						$scope.listUsers = response.data;
					});
			}

		}

		$scope.searchClick = function () {
			var search = $scope.searchValue;
			var urlUser = url + '/admin/usermanager/searchId/' + search;

			$http.get(urlUser)
				.then(function (response) {
					$scope.profile = response.data;
				});
		}

		$scope.updateRole = async function (sdt, roleId) {
			const inputOptions = new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						'2': 'Staff',
						'3': 'User'
					})
				}, 500)
			})

			const { value: role } = await Swal.fire({
				title: 'Chọn vai trò?',
				input: 'radio',
				icon: 'question',
				inputOptions: inputOptions,
				inputValidator: (value) => {
					if (!value) {
						return 'Chưa chọn vai trò!'
					}
				}
			})

			if (role) {
				const swalWithBootstrapButtons = Swal.mixin({
					customClass: {
						confirmButton: 'btn btn-success',
						cancelButton: 'btn btn-danger me-2'
					},
					buttonsStyling: false
				})

				swalWithBootstrapButtons.fire({
					text: "Bạn có chắc chắn muốn đổi vai trò không?",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Có, chắc chắn',
					cancelButtonText: 'Hủy',
					reverseButtons: true
				}).then((result) => {
					if (result.isConfirmed) {
						if (role == roleId) {
							Swal.fire(
								'Lỗi!',
								'Đã có vai trò này!',
								'warning'
							)
						} else {
							$http.put(url + '/admin/usermanager/userRole/' + sdt + '/' + role)
								.then(function (response) {
									$scope.profile = response.data;
									swalWithBootstrapButtons.fire(
										'Thành công!',
										'Vai trò đã được cập nhật',
										'success'
									)
								})
								.catch(function (error) {
									// Xử lý lỗi
									console.log(error);
									Swal.fire(
										'Lỗi!',
										'Không thể cập nhật vai trò!',
										'error'
									)
								});
						}

					}
				});
			}
		}

		$scope.resetViolation = function (userId, violationCount) {
			const swalWithBootstrapButtons = Swal.mixin({
				customClass: {
					confirmButton: 'btn btn-success',
					cancelButton: 'btn btn-danger me-2'
				},
				buttonsStyling: false
			})

			swalWithBootstrapButtons.fire({
				text: "Bạn có chắc chắn muốn gỡ lượt vi phạm không?",
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Có, chắc chắn',
				cancelButtonText: 'Hủy',
				reverseButtons: true
			}).then((result) => {
				if (result.isConfirmed && violationCount > 0) {
					$http.put(url + '/admin/usermanager/userViolations/' + userId)
						.then(function (response) {
							$scope.profile = response.data;
							swalWithBootstrapButtons.fire(
								'Thành công!',
								'Đã gỡ lượt vi phạm',
								'success'
							)
						})
						.catch(function (error) {
							// Xử lý lỗi
							console.log(error);
							Swal.fire(
								'Lỗi!',
								'Không thể gỡ lượt vi phạm!',
								'error'
							)
						});
				} else {
					Swal.fire(
						'Lỗi!',
						'Người dùng hiện tại không có lượt vi phạm!',
						'warning'
					)
				}
			})
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
	}
);
