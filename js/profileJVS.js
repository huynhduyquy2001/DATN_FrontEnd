
var selectedMedia = []; // Mảng để lưu trữ các tệp đã chọn từ cả hai lần chọn hình ảnh

document.getElementById('dropArea').addEventListener('click',
    function () {
        document.getElementById('inputGroupFile01').click();
    });

document.getElementById('inputGroupFile01').addEventListener('change',
    function () {
        handleFiles(this.files);
    });

function dropHandler(event) {
    event.preventDefault();
    var files = event.dataTransfer.files;
    handleFiles(files);
}

function handleFiles(files) {
    var mediaType = /^image\//;
    var videoType = /^video\//;
    var mediaList = document.getElementById('mediaList');

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (mediaType.test(file.type) || videoType.test(file.type)) {
            var reader = new FileReader();
            reader.onload = (function (file) {
                return function () {
                    if (mediaType.test(file.type)) {
                        var media = new Image();
                        media.src = this.result;
                        media.classList.add('previewMedia');
                        var container = createMediaContainer(media,
                            file);
                        mediaList.appendChild(container);
                    } else if (videoType.test(file.type)) {
                        var media = document.createElement('video');
                        media.src = this.result;
                        media.setAttribute('controls', 'controls');
                        media.classList.add('previewMedia');
                        var container = createMediaContainer(media,
                            file);
                        mediaList.appendChild(container);
                    }
                };
            })(file);
            reader.readAsDataURL(file);
            selectedMedia.push(file);
        }
    }

    // Cập nhật lại những ảnh hoặc video đã chọn trong phần tử <input>
    var dataTransfer = new DataTransfer();
    for (var i = 0; i < selectedMedia.length; i++) {
        dataTransfer.items.add(selectedMedia[i]);
    }
    document.getElementById('inputGroupFile01').files = dataTransfer.files;
}

function createMediaContainer(media, file) {
    var container = document.createElement('div');
    container.classList.add('previewMediaContainer');
    container.appendChild(media);

    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'X';
    deleteButton.classList.add('deleteButton');
    deleteButton
        .addEventListener(
            'click',
            function () {
                // Xóa hình ảnh khỏi giao diện và khỏi mảng selectedMedia khi người dùng xóa
                var index = selectedMedia.indexOf(file);
                if (index !== -1) {
                    selectedMedia.splice(index, 1);
                }
                // Cập nhật lại những ảnh hoặc video đã chọn trong phần tử <input>
                var dataTransfer = new DataTransfer();
                for (var i = 0; i < selectedMedia.length; i++) {
                    dataTransfer.items.add(selectedMedia[i]);
                }
                document.getElementById('inputGroupFile01').files = dataTransfer.files;

                container.remove();
            });

    container.appendChild(deleteButton);

    return container;
}

function dragOverHandler(event) {
    event.preventDefault();
    event.target.classList.add('active');
}

function dragLeaveHandler(event) {
    event.preventDefault();
    event.target.classList.remove('active');
}
function toggleColor(link) {
    var allLinks = document.getElementsByClassName("colorful-link");

    for (var i = 0; i < allLinks.length; i++) {
        var currentLink = allLinks[i];
        currentLink.classList.remove("active"); // Loại bỏ lớp 'active' từ tất cả các thẻ

        if (currentLink === link) {
            link.classList.add("active"); // Thêm lớp 'active' vào thẻ được bấm
        }
    }
}

function displayAvatar() {
    var input = document.getElementById('inputGroupFile03');
    var imgElement = document.getElementById('img');

    // Kiểm tra xem người dùng đã chọn ảnh hay chưa
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imgElement.src = e.target.result; // Gán đường dẫn của ảnh cho src của thẻ img
        }

        reader.readAsDataURL(input.files[0]); // Đọc và chuyển đổi ảnh thành đường dẫn dạng Base64
    }
}
function displayBackground() {
    var input = document.getElementById('inputGroupFile02');
    var imgElement = document
        .getElementById('imgBackground');

    // Kiểm tra xem người dùng đã chọn ảnh hay chưa
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imgElement.src = e.target.result; // Gán đường dẫn của ảnh cho src của thẻ img
        }

        reader.readAsDataURL(input.files[0]); // Đọc và chuyển đổi ảnh thành đường dẫn dạng Base64
    }
}
function displayImagePreview(inputId, imgId) {
    var input = document.getElementById(inputId);
    var imgElement = document.getElementById(imgId);

    // Kiểm tra xem người dùng đã chọn ảnh hay chưa
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imgElement.src = e.target.result; // Gán đường dẫn của ảnh cho src của thẻ img
        }

        reader.readAsDataURL(input.files[0]); // Đọc và chuyển đổi ảnh thành đường dẫn dạng Base64
    }
}
