app.controller("ShoppingCartController", function ($scope, $http, $timeout, $route) {
  var url = "http://localhost:8080";
  $scope.listProducts = [];

  $http
    .get(url + "/get-product-shoppingcart")
    .then(function (response) {
      var grouped = {};
      angular.forEach(response.data, function (product) {
        var userId = product.product.user.userId;
        if (!grouped[userId]) {
          grouped[userId] = [];
        }
        grouped[userId].push(product);
      });
      $scope.listProducts = grouped;
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    });

  //tính giá khuyếb mãi
  $scope.getSalePrice = function (originalPrice, promotion) {
    if (promotion === 0) {
      return originalPrice;
    } else {
      //tính tổng số lượng các đánh giá
      var SalePrice = originalPrice - (originalPrice * promotion) / 100;
      return SalePrice;
    }
  };

  //lấy ảnh đầu tiên
  $scope.filterImagesByProductId = function (mediaList) {
    var uniqueProducts = {};
    var filteredList = [];

    mediaList.forEach(function (img) {
      if (!uniqueProducts[img.productId]) {
        uniqueProducts[img.productId] = true;
        filteredList.push(img);
      }
    });

    return filteredList;
  };

  //tính tổng giá tiền khi gõ vào
  $scope.recalculatePrice = function (product) {
    product.totalPrice = $scope.calculateSubtotal(product);
    //sửa số lượng trong giỏ hàng
    $scope.setQuantity(product, product.quantity);
  };

  //tính tổng giá tiền khi load lên
  $scope.calculateSubtotal = function (product) {
    return (
      $scope.getSalePrice(
        product.product.originalPrice,
        product.product.promotion
      ) * product.quantity
    );
  };

  //tính tổng giá tiền khi click button +
  $scope.incrementQuantity = function (product) {
    product.quantity++;
    $scope.recalculatePrice(product);
    //tăng số lượng trong giỏ hàng
    $scope.addQuantity(product, 1);

  };

  //tính tổng giá tiền khi click button -
  $scope.decrementQuantity = function (product) {
    if (product.quantity > 1) {
      product.quantity--;
      $scope.recalculatePrice(product);
      //giảm số lượng trong giỏ hàng
      $scope.minusQuantity(product, 1);
    }
  };

  //Hàm thêm số lượng vào giỏ hàng
  $scope.addQuantity = function (product, quantity) {
    //thêm số lượng vào giỏ hàng
    var formData = new FormData();
    formData.append("productId", product.product.productId);
    formData.append("quantity", quantity);
    formData.append("color", product.color);

    $http
      .post(url + "/add-to-cart", formData, {
        transformRequest: angular.identity,
        headers: { "Content-Type": undefined },
      })
      .then(function (res) {
        // Xử lý phản hồi từ máy chủ
      });
  };

  //Hàm giảm số lượng trong giỏ hàng
  $scope.minusQuantity = function (product, quantity) {
    //giảm số lượng trong giỏ hàng
    var formData = new FormData();
    formData.append("productId", product.product.productId);
    formData.append("quantity", quantity);
    formData.append("color", product.color);

    $http
      .post(url + "/minusQuantity-to-cart", formData, {
        transformRequest: angular.identity,
        headers: { "Content-Type": undefined },
      })
      .then(function (res) {
        // Xử lý phản hồi từ máy chủ
      });
  };

  //Hàm thêm số lượng vào giỏ hàng
  $scope.setQuantity = function (product, quantity) {
    //thêm số lượng vào giỏ hàng
    var formData = new FormData();
    formData.append("productId", product.product.productId);
    formData.append("quantity", quantity);
    formData.append("color", product.color);

    $http
      .post(url + "/setQuantity-to-cart", formData, {
        transformRequest: angular.identity,
        headers: { "Content-Type": undefined },
      })
      .then(function (res) {
        // Xử lý phản hồi từ máy chủ
      });
  };


  //xử lý checkbox
  var isChecked = false;

  $scope.checkAll = function () {
    checked();
    $scope.getSumPrice();
  }

  $scope.updateCount = function () {
    updateCountChecked();
    $scope.getSumPrice();
  }

  function checked() {
    isChecked = !isChecked;
    $('input[type="checkbox"]').prop('checked', isChecked);
    updateCountChecked();
  }

  //hiện số lượng checkbox
  function updateCountChecked() {
    var checkedCount = $('input[type="checkbox"]:checked:visible').length;
    $('.count-product').text(checkedCount);
  }

  //Tính tổng khi click vào checkbox
  $scope.sumPrice = 0;
  $scope.getSumPrice = function () {
    // Lấy tất cả các phần tử input có type là checkbox
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Lưu giá trị từ các checkbox
    var sum = 0;

    // Duyệt qua từng checkbox và kiểm tra xem nó có được chọn và hiển thị không
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked && checkbox.offsetParent !== null) {
        sum += parseInt(checkbox.value);
      }
    });

    // Đưa giá trị vào biến $scope.sumPrice
    $scope.sumPrice = sum;
  };

  //Thêm vào danh sách sản phẩm yêu thích
  $scope.addFavoriteProducts = function () {
    // Lấy tất cả các phần tử input có type là checkbox
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // Lưu giá trị từ các checkbox
    var productIds = [];
    // Duyệt qua từng checkbox và kiểm tra xem nó có được chọn và hiển thị không
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked && checkbox.offsetParent !== null) {
        var productIdAndColor = checkbox.id.split('_');
        var productId = productIdAndColor[0];
        productIds.push(productId);
      }
    });

    if (productIds.length === 0) {
      Swal.fire({
        position: 'top',
        icon: 'warning',
        text: 'Chưa chọn sản phẩm để thêm vào yêu thích!',
        showConfirmButton: false,
        timer: 1800
      });
    } else {
      Swal.fire({
        text: 'Bạn muốn thêm ' + productIds.length + ' sản phẩm vào danh sách yêu thích?',
        icon: 'warning',
        confirmButtonText: 'Có, chắc chắn',
        showCancelButton: true,
        confirmButtonColor: '#159b59',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          $http({
            method: 'POST',
            url: url + '/addFavouriteProducts',
            data: JSON.stringify(productIds),
            contentType: 'application/json'
          }).then(function (response) {
            Swal.fire({
              position: 'top',
              icon: response.data.status,
              text: response.data.message,
              showConfirmButton: false,
              timer: 1800
            });
          }).catch(function (error) {
            console.error("Error:", error);
            Swal.fire({
              position: 'top',
              icon: 'error',
              text: 'Thêm vào yêu thích thất bại',
              showConfirmButton: false,
              timer: 1800
            });
          });
        }
      });
    }

  }

  //Xóa các input được chọn
  $scope.deleteAll = function () {
    // Lấy tất cả các phần tử input có type là checkbox
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // Lưu giá trị từ các checkbox
    var listColorAndProductId = [];
    // Duyệt qua từng checkbox và kiểm tra xem nó có được chọn và hiển thị không
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked && checkbox.offsetParent !== null) {
        var productIdAndColor = checkbox.id.split('_');
        var productId = productIdAndColor[0];
        var color = productIdAndColor[1];
        listColorAndProductId.push({ productId: productId, color: color });
      }
    });

    if (listColorAndProductId.length === 0) {
      Swal.fire({
        position: 'top',
        icon: 'warning',
        text: 'Chưa chọn sản phẩm để xóa khỏi giỏ hàng!',
        showConfirmButton: false,
        timer: 1800
      });
    } else {
      Swal.fire({
        text: 'Bạn muốn xóa ' + listColorAndProductId.length + ' sản phẩm khỏi giỏ hàng?',
        icon: 'warning',
        confirmButtonText: 'Có, chắc chắn',
        showCancelButton: true,
        confirmButtonColor: '#159b59',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          $http({
            method: 'POST',
            url: url + '/deleteToCart',
            data: listColorAndProductId,
            contentType: 'application/json'
          }).then(function (response) {
            Swal.fire({
              position: 'top',
              icon: response.data.status,
              text: response.data.message,
              showConfirmButton: false,
              timer: 1800
            });
            $scope.reloadPageWithDelay();
          }).catch(function (error) {
            console.error("Error:", error);
            Swal.fire({
              position: 'top',
              icon: 'error',
              text: 'Xóa sản phẩm thất bại',
              showConfirmButton: false,
              timer: 1800
            });
          });
        }
      });
    }

  }

  //Xóa 1 sản phẩm
  $scope.deleteToCart = function (productId, color) {
    var listColorAndProductId = [];
    listColorAndProductId.push({ productId: productId, color: color });
    if (listColorAndProductId.length === 0) {
      Swal.fire({
        position: 'top',
        icon: 'warning',
        text: 'Chưa chọn sản phẩm để xóa khỏi giỏ hàng!',
        showConfirmButton: false,
        timer: 1800
      });
    } else {
      Swal.fire({
        text: 'Bạn muốn xóa sản phẩm khỏi giỏ hàng?',
        icon: 'warning',
        confirmButtonText: 'Có, chắc chắn',
        showCancelButton: true,
        confirmButtonColor: '#159b59',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          $http({
            method: 'POST',
            url: url + '/deleteToCart',
            data: listColorAndProductId,
            contentType: 'application/json'
          }).then(function (response) {
            Swal.fire({
              position: 'top',
              icon: response.data.status,
              text: response.data.message,
              showConfirmButton: false,
              timer: 1800
            });
            $scope.reloadPageWithDelay();
          }).catch(function (error) {
            console.error("Error:", error);
            Swal.fire({
              position: 'top',
              icon: 'error',
              text: 'Xóa sản phẩm thất bại',
              showConfirmButton: false,
              timer: 1800
            });
          });
        }
      });
    }
  }

  //Hàm reload lại trang
  $scope.reloadPageWithDelay = function () {
    $timeout(function () {
      $route.reload();
    }, 1800); // 2000 milliseconds là 2 giây
  };

});
