app.controller('AddProductsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    $scope.product = {};
    $scope.colors = [];
    $scope.selectedColors = [];
    $scope.productId = "";

    $scope.isColorSelected = function (colorId) {
        // Kiểm tra xem màu sắc có trong danh sách $scope.selectedColors hay không
        // Trả về true nếu màu đã được chọn, ngược lại trả về false
        return $scope.selectedColors.some(function (selectedColor) {
            return selectedColor.color.colorId === colorId;
        });
    };


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

    $scope.addProduct = function () {
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
                icon: 'warning',
                title: 'Vui lòng chọn một hoặc nhiều màu sắc'
            })
            return;
        }
        $http.post(Url + '/products/add', $scope.product)
            .then(function (response) {
                var productId = response.data.productId;
                $scope.sendMedia(productId);
                $scope.saveProductColor(productId);

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

    $scope.sendMedia = function (productId) {
        var fileInput = document.getElementById('inputGroupFile01');
        // Check if no files are selected
        if (fileInput.files.length === 0) {
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
    $scope.saveProductColor = function (productId) {
        // Duyệt qua mảng selectedColors để tạo danh sách màu sắc
        $scope.selectedColors.forEach(function (selectedColor) {
            var formData = new FormData();
            var colorObj = selectedColor.color;
            var quantity = selectedColor.quantity;

            formData.append('colorId', JSON.stringify(colorObj.colorId));
            formData.append('quantity', JSON.stringify(quantity));
            // Gửi yêu cầu POST với danh sách màu
            $http.post(Url + '/save-productcolor/' + productId, formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
                .then(function (response) {
                    // Xử lý kết quả ở đây, response.data có thể chứa thông tin từ máy chủ sau khi lưu
                    console.log(response.data);
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
            console.log($scope.colors)
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
            $scope.product.productColors.find(function (obj) {
                if (obj.color.colorId == colorId) {
                    id = obj.id;
                }
            })
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
});