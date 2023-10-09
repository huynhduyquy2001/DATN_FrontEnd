app.controller('AddProductsController', function ($scope, $http, $translate, $rootScope, $location, $routeParams) {
    var Url = "http://localhost:8080";
    var isChecked = false;
    $scope.product = {};
    $scope.colors = [];
    $scope.selectedColors = [];
    $scope.productId = "";

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
    $scope.toggleColorSelection = function (color) {
        if (color.selected) {
            // Nếu checkbox được chọn, thêm màu vào mảng
            var colorO = $scope.colors.find(function (obj) {
                return obj.colorId === color.colorId;
            });
            var colorObj = {
                "color": {
                    "colorId": colorO.colorId,
                    "colorName": colorO.colorName
                },
                "quantity": 1 // Cập nhật quantity thành 1 khi màu được chọn
            };
            $scope.selectedColors.push(colorObj); // Thêm colorO vào mảng selectedColors
        } else {
            // Nếu checkbox không được chọn, xóa màu khỏi mảng
            var index = $scope.selectedColors.findIndex(function (selectedColor) {
                return selectedColor.color.colorId === color.colorId;
            });
            if (index !== -1) {
                $scope.selectedColors.splice(index, 1);
            }
        }
    };





});