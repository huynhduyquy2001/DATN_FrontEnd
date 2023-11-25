app.controller('AddProductsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams, $window) {
    var Url = "http://localhost:8080";
    $scope.product = {};
    $scope.colors = [];
    $scope.selectedColors = [];
    $scope.productId = "";
    $scope.addAndUpdate = 1;
    $scope.ticketCount = 0;
    $scope.deleteMedia = function (mediaId) {
        Swal.fire({
            text: 'Bạn muốn xóa ảnh khỏi sản phẩm? Dữ liệu sẽ không được phục hồi',
            icon: 'warning',
            confirmButtonText: 'Có, chắc chắn',
            showCancelButton: true,
            confirmButtonColor: '#159b59',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                $http.post(Url + '/delete-media/' + mediaId)
                    .then(function (response) {
                        $scope.product.media = $scope.product.media.filter(function (media) {
                            return media.mediaId !== mediaId;
                        });

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
                            title: 'Xóa hình ảnh thành công'
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    }

    $scope.isColorSelected = function (colorId) {
        // Kiểm tra xem màu sắc có trong danh sách $scope.selectedColors hay không
        // Trả về true nếu màu đã được chọn, ngược lại trả về false
        return $scope.selectedColors.some(function (selectedColor) {
            return selectedColor.color.colorId === colorId;
        });
    };
    if ($routeParams.productId) {
        $scope.addAndUpdate = 2;
        $http.get(Url + '/get-product/' + $routeParams.productId)
            .then(function (response) {
                $scope.product = response.data;
                $scope.selectedColors = response.data.productColors;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    $scope.getSticket = function () {
        $http.get(Url + '/get-ticket')
            .then(function (response) {
                $scope.ticketCount = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    $scope.getSticket();
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
    $scope.updateProduct = function () {
        if ($scope.selectedColors.length === 0) {
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
                icon: 'info',
                title: 'Vui lòng chọn một hoặc nhiều màu sắc'
            })
            return;
        }
        $http.post(Url + '/products/add', $scope.product)
            .then(function (response) {
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
                    icon: 'info',
                    title: 'Đang kiểm tra thông tin sản phẩm'
                })
                var productId = response.data.productId;
                $scope.updateProductColor(productId);
                $scope.updateMedia(productId);
            })
            .catch(function (error) {
                // Xử lý lỗi (nếu có)
                console.log(error);
            });
    }

    $scope.addProduct = function () {
        if ($scope.ticketCount === 0) {
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
                title: 'Đã hết lượt đăng bài, vui lòng mua thêm'
            })
            return;
        }

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
                title: 'Vui lòng chọn ít nhất 1 ảnh!!!'
            })
            return;
        }

        if ($scope.selectedColors.length === 0) {
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
                icon: 'info',
                title: 'Vui lòng chọn một hoặc nhiều màu sắc'
            })
            return;
        }
        $http.post(Url + '/products/add', $scope.product)
            .then(function (response) {
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
                    icon: 'info',
                    title: 'Đang kiểm tra thông tin sản phẩm'
                })
                var productId = response.data.productId;
                $scope.saveProductColor(productId);
                $scope.sendMedia(productId);

                var productTemp = {
                    'tempId': null,
                    'productId': response.data.productId,
                    'productName': response.data.productName,
                    'originalPrice': response.data.originalPrice,
                    'datePost': response.data.datePost,
                    'userName': response.data.user.userName
                };


                $http.post(Url + '/add-product-temp', productTemp)
                    .then(function (response) {
                        $http.get(Url + '/update-ticket')
                            .then(function (response) {
                                $scope.ticketCount = response.data;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });


            })
            .catch(function (error) {
                // Xử lý lỗi (nếu có)
                console.log(error);
            });

    };
    // Hàm để lấy phần mở rộng từ tên tệp
    function getFileExtensionFromFileName(fileName) {
        return fileName.split('.').pop().toLowerCase();
    }

    $scope.updateMedia = function (productId) {
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
                icon: 'success',
                title: 'Sản phẩm được đăng thành công, đang trong quá trình chờ duyệt'
            })

            return;
        }

    }

    $scope.sendMedia = function (productId) {
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
                icon: 'success',
                title: 'Sản phẩm được đăng thành công, đang trong quá trình chờ duyệt'
            })
            if ($routeParams.productId) {
                $http.get(Url + '/get-product/' + $routeParams.productId)
                    .then(function (response) {
                        $scope.product = response.data;
                        $scope.selectedColors = response.data.productColors;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            return;
        }

        var storage = firebase.storage();
        var storageRef = storage.ref();

        var uploadMedia = function (fileIndex) {
            if (fileIndex >= fileInput.files.length) {
                // All files have been uploaded
                fileInput.value = null;
                var mediaList = document.getElementById('mediaList');
                mediaList.innerHTML = '';
                $window.selectedMedia = [];
                $scope.product = {};
                $scope.selectedColors = [];
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
                    title: 'Sản phẩm đã được cập nhật'
                })
                if ($routeParams.productId) {
                    $http.get(Url + '/get-product/' + $routeParams.productId)
                        .then(function (response) {
                            $scope.product = response.data;
                            $scope.selectedColors = response.data.productColors;
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
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
            }, function (error) {
                alert("Lỗi tải");
            }, function () {
                // Tải lên thành công, lấy URL của tệp từ Firebase Storage
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    var formData = new FormData();
                    formData.append('mediaUrl', downloadURL);
                    $http.post(Url + '/send-media/' + productId, formData, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).then(function (response) {
                        // Tiếp tục tải và gửi ảnh tiếp theo
                        uploadMedia(fileIndex + 1);
                    }).catch(function (error) {
                        console.error('Lỗi tải lên tệp:', error);
                    });

                }).catch(function (error) {
                    console.error('Error getting download URL:', error);
                });
            });
        };
        // Bắt đầu tải và gửi ảnh từ fileInput.files[0]
        uploadMedia(0);
    }

    $scope.updateProductColor = function (productId) {
        // Duyệt qua mảng selectedColors để tạo danh sách màu sắc
        $scope.selectedColors.forEach(function (selectedColor) {
            var formData = new FormData();
            var colorObj = selectedColor.color;
            var quantity = selectedColor.quantity;
            formData.append('colorId', colorObj.colorId);
            formData.append('quantity', quantity);
            // Gửi yêu cầu POST với danh sách màu
            $http.post(Url + '/save-productcolor/' + productId, formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                .then(function (response) {

                })
                .catch(function (error) {
                    console.log(error);
                });
        });
        // Duyệt qua mảng selectedColors để tạo danh sách màu sắc
        $scope.product.productColors.forEach(function (color) {

            var index = $scope.selectedColors.findIndex(function (selectedColor) {
                return selectedColor.id == color.id;
            });
            if (index === -1) {
                $http.post(Url + '/delete-productcolor/' + color.id)
                    .then(function (response) {

                    })
            }

        });
        // Thêm danh sách màu vào FormData
    };

    $scope.saveProductColor = function (productId) {
        // Duyệt qua mảng selectedColors để tạo danh sách màu sắc
        $scope.selectedColors.forEach(function (selectedColor) {
            var formData = new FormData();
            var colorObj = selectedColor.color;
            var quantity = selectedColor.quantity;
            formData.append('colorId', colorObj.colorId);
            formData.append('quantity', quantity);
            // Gửi yêu cầu POST với danh sách màu
            $http.post(Url + '/save-productcolor/' + productId, formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                .then(function (response) {

                })
                .catch(function (error) {
                    console.log(error);
                });
        });
        // Thêm danh sách màu vào FormData
    };

    // Hàm để lấy danh sách màu sắc từ server
    $http.get(Url + '/products/color')
        .then(function (response) {
            // Dữ liệu trả về từ API sẽ nằm trong response.data
            $scope.colors = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    $scope.toggleColorSelection = function (colorId) {
        var index = $scope.selectedColors.findIndex(function (selectedColor) {
            return selectedColor.color.colorId == colorId;
        });

        if (index === -1) {
            // Nếu index k có tồn tại sẽ thêm vào mảng
            var colorO = $scope.colors.find(function (obj) {
                return obj.colorId === colorId;
            });
            var id = null;
            if ($scope.product.productId != null) {
                $scope.product.productColors.find(function (obj) {
                    if (obj.color.colorId == colorId) {
                        id = obj.id;
                    }
                })
            }
            var colorObj = {
                "id": id,
                "color": {
                    "colorId": colorO.colorId,
                    "colorName": colorO.colorName
                },
                "quantity": 1 // Cập nhật quantity thành 1 khi màu được chọn
            };
            $scope.selectedColors.push(colorObj); // Thêm colorO vào mảng selectedColors
        } else if (index !== -1) {
            // Nếu index có tồn tại
            // Nếu index tồn tại, xóa màu khỏi mảng
            var newSelectedColors = angular.copy($scope.selectedColors);
            newSelectedColors.splice(index, 1);
            $scope.selectedColors = newSelectedColors;
        }
    };
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