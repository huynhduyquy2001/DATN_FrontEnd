app.controller("ShoppingCartController", function ($scope, $http, $rootScope, $window, $timeout, $location) {
  var url = "http://localhost:8080";
  var token = "ad138b51-6784-11ee-a59f-a260851ba65c";
  $scope.listProducts = [];
  $scope.listProductOrder = [];
  $scope.listProvince = [];
  $scope.listDistrict = [];
  $scope.listWard = [];
  $scope.deliveryAddress = [];
  $scope.fee = [];
  $scope.checkShip = false;
  $scope.oneAddress = {};
  $scope.checkPay = false;
  var dataListProduct;
  var dataAddress;
  $scope.loadData = function () {
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
        $rootScope.listProduct = response.data;
      })
      .catch(function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  };

  //Load giỏ hàng
  $scope.loadData();

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
  };

  $scope.updateCount = function () {
    updateCountChecked();
    $scope.getSumPrice();
  };

  function checked() {
    isChecked = !isChecked;
    $('input[type="checkbox"]').prop("checked", isChecked);
    updateCountChecked();
  }

  //hiện số lượng checkbox
  function updateCountChecked() {
    var checkedCount = $('input[type="checkbox"]:checked:visible').length;
    $(".count-product").text(checkedCount);
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
        var productIdAndColor = checkbox.id.split("_");
        var productId = productIdAndColor[0];
        productIds.push(productId);
      }
    });

    if (productIds.length === 0) {
      Swal.fire({
        position: "top",
        icon: "warning",
        text: "Chưa chọn sản phẩm để thêm vào yêu thích!",
        showConfirmButton: false,
        timer: 1800,
      });
    } else {
      Swal.fire({
        text:
          "Bạn muốn thêm " +
          productIds.length +
          " sản phẩm vào danh sách yêu thích?",
        icon: "warning",
        confirmButtonText: "Có, chắc chắn",
        showCancelButton: true,
        confirmButtonColor: "#159b59",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          $http({
            method: "POST",
            url: url + "/addFavouriteProducts",
            data: JSON.stringify(productIds),
            contentType: "application/json",
          })
            .then(function (response) {
              Swal.fire({
                position: "top",
                icon: response.data.status,
                text: response.data.message,
                showConfirmButton: false,
                timer: 1800,
              });
            })
            .catch(function (error) {
              console.error("Error:", error);
              Swal.fire({
                position: "top",
                icon: "error",
                text: "Thêm vào yêu thích thất bại",
                showConfirmButton: false,
                timer: 1800,
              });
            });
        }
      });
    }
  };

  //Xóa các input được chọn
  $scope.deleteAll = function () {
    // Lấy tất cả các phần tử input có type là checkbox
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // Lưu giá trị từ các checkbox
    var listColorAndProductId = [];
    // Duyệt qua từng checkbox và kiểm tra xem nó có được chọn và hiển thị không
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked && checkbox.offsetParent !== null) {
        var productIdAndColor = checkbox.id.split("_");
        var productId = productIdAndColor[0];
        var color = productIdAndColor[1];
        listColorAndProductId.push({ productId: productId, color: color });
      }
    });

    if (listColorAndProductId.length === 0) {
      Swal.fire({
        position: "top",
        icon: "warning",
        text: "Chưa chọn sản phẩm để xóa khỏi giỏ hàng!",
        showConfirmButton: false,
        timer: 1800,
      });
    } else {
      Swal.fire({
        text:
          "Bạn muốn xóa " +
          listColorAndProductId.length +
          " sản phẩm khỏi giỏ hàng?",
        icon: "warning",
        confirmButtonText: "Có, chắc chắn",
        showCancelButton: true,
        confirmButtonColor: "#159b59",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          $http({
            method: "POST",
            url: url + "/deleteToCart",
            data: listColorAndProductId,
            contentType: "application/json",
          })
            .then(function (response) {
              Swal.fire({
                position: "top",
                icon: response.data.status,
                text: response.data.message,
                showConfirmButton: false,
                timer: 1800,
              });
              $scope.loadData();
            })
            .catch(function (error) {
              console.error("Error:", error);
              Swal.fire({
                position: "top",
                icon: "error",
                text: "Xóa sản phẩm thất bại",
                showConfirmButton: false,
                timer: 1800,
              });
            });
        }
      });
    }
  };

  //Xóa 1 sản phẩm
  $scope.deleteToCart = function (productId, color) {
    var listColorAndProductId = [];
    listColorAndProductId.push({ productId: productId, color: color });
    if (listColorAndProductId.length === 0) {
      Swal.fire({
        position: "top",
        icon: "warning",
        text: "Chưa chọn sản phẩm để xóa khỏi giỏ hàng!",
        showConfirmButton: false,
        timer: 1800,
      });
    } else {
      Swal.fire({
        text: "Bạn muốn xóa sản phẩm khỏi giỏ hàng?",
        icon: "warning",
        confirmButtonText: "Có, chắc chắn",
        showCancelButton: true,
        confirmButtonColor: "#159b59",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          $http({
            method: "POST",
            url: url + "/deleteToCart",
            data: listColorAndProductId,
            contentType: "application/json",
          })
            .then(function (response) {
              Swal.fire({
                position: "top",
                icon: response.data.status,
                text: response.data.message,
                showConfirmButton: false,
                timer: 1800,
              });
              $scope.loadData();
            })
            .catch(function (error) {
              console.error("Error:", error);
              Swal.fire({
                position: "top",
                icon: "error",
                text: "Xóa sản phẩm thất bại",
                showConfirmButton: false,
                timer: 1800,
              });
            });
        }
      });
    }
  };

  //Đặt hàng
  $scope.orderShoppingCart = function () {
    // Lấy tất cả các phần tử input có type là checkbox
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // Lưu giá trị từ các checkbox
    var listColorAndProductId = [];
    // Duyệt qua từng checkbox và kiểm tra xem nó có được chọn và hiển thị không
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked && checkbox.offsetParent !== null) {
        var productIdAndColor = checkbox.id.split("_");
        var productId = productIdAndColor[0];
        var color = productIdAndColor[1];
        listColorAndProductId.push({ productId: productId, color: color });
      }
    });
    if (listColorAndProductId.length === 0) {
      Swal.fire({
        position: "top",
        icon: "warning",
        text: "Chưa chọn sản phẩm để đặt hàng!",
        showConfirmButton: false,
        timer: 1800,
      });
    } else {
      //load thông tin sản phẩm đang chọn
      dataListProduct = $http({
        method: "POST",
        url: url + "/orderShoppingCart",
        data: listColorAndProductId,
        contentType: "application/json",
      })
        .then(function (response) {
          var grouped = {};
          angular.forEach(response.data, function (product) {
            var userId = product.product.user.userId;
            if (!grouped[userId]) {
              grouped[userId] = [];
            }
            grouped[userId].push(product);
          });
          $scope.listProductOrder = grouped;
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
      //Hiện modal
      $scope.checkShip = false;
      $scope.fee = []
      $("#exampleModal").modal("show");
    }
  };

  $scope.showAddress = function () {
    //Ẩn modal đặt hàng
    $("#exampleModal").modal("hide");

    //Load địa chỉ giao hàng
    $http.get(url + "/get-address")
      .then(function (response) {
        $scope.deliveryAddress = response.data;
        if (response.data.length == 0) {
          //Hiện tab địa chỉ trước  
          $('#profile-tab').tab('show');
        } else {
          //Hiện tab địa chỉ trước  
          $('#home-tab').tab('show');
        }
      })
      .catch(function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });

    //Hiện modal chọn địa chỉ
    $("#modalAddress").modal("show");
  };

  //Lấy danh sách Tỉnh thành phố
  $scope.showProvince = function () {
    $http({
      method: "POST",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      headers: {
        Token: token,
      },
    })
      .then(function (response) {
        // Xử lý phản hồi thành công
        $scope.listProvince = response.data.data;
      })
      .catch(function (error) {
        // Xử lý lỗi
        console.error("API request failed:", error);
        // In ra nội dung đối tượng lỗi
        console.log("Error Object:", error);
      });

    //Clear form thêm địa chỉ
    $scope.clearForm();
  };

  //Lấy danh sách Quận huyện
  $scope.onProvince = function () {
    $http({
      method: "POST",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      headers: {
        Token: token,
      },
      data: {
        province_id: $scope.selectedProvince.ProvinceID,
      },
    })
      .then(function (response) {
        // Xử lý phản hồi thành công
        $scope.listDistrict = response.data.data;
      })
      .catch(function (error) {
        // Xử lý lỗi
        console.error("API request failed:", error);
        // In ra nội dung đối tượng lỗi
        console.log("Error Object:", error);
      });
  };

  //Lấy danh sách Phường xã
  $scope.onDistrict = function () {
    $http({
      method: "POST",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      headers: {
        Token: token,
      },
      data: {
        district_id: $scope.selectedDistrict.DistrictID,
      },
    })
      .then(function (response) {
        // Xử lý phản hồi thành công
        $scope.listWard = response.data.data;
      })
      .catch(function (error) {
        // Xử lý lỗi
        console.error("API request failed:", error);
        // In ra nội dung đối tượng lỗi
        console.log("Error Object:", error);
      });
  };

  //Thêm địa chỉ
  $scope.addAddress = function () {
    var inputElement = document.getElementById("phone");
    // Lấy giá trị từ input
    var inputValue = inputElement.value;

    if (
      $scope.selectedDistrict == null ||
      $scope.selectedProvince == null ||
      $scope.selectedWard == null ||
      inputValue == ''
    ) {
      Swal.fire({
        position: "top",
        icon: "warning",
        text: "Chưa đủ thông tin địa chỉ!",
        showConfirmButton: false,
        timer: 1800,
      });
    } else {
      //Thêm địa chỉ
      var content = "";
      var formData = new FormData();
      formData.append("districtID", $scope.selectedDistrict.DistrictID);
      formData.append("districtName", $scope.selectedDistrict.DistrictName);
      formData.append("provinceID", $scope.selectedProvince.ProvinceID);
      formData.append("provinceName", $scope.selectedProvince.ProvinceName);
      formData.append("wardCode", $scope.selectedWard.WardCode);
      formData.append("wardName", $scope.selectedWard.WardName);
      formData.append("deliveryPhone", inputValue);
      formData.append("addressStore", false);
      if ($scope.textareaValue != null) {
        content = $scope.textareaValue;
      }
      formData.append("detailAddress", content);

      $http
        .post(url + "/add-to-DeliveryAddress", formData, {
          transformRequest: angular.identity,
          headers: { "Content-Type": undefined },
        })
        .then(function (response) {
          $scope.deliveryAddress = response.data;
          $scope.clearForm();
          //Trở về tabs địa chỉ 
          $('#home-tab').tab('show');

          Swal.fire({
            position: "top",
            icon: "success",
            text: "Thêm địa chỉ thành công",
            showConfirmButton: false,
            timer: 800,
          });
        });
    }
  };

  //Xóa địa chỉ
  $scope.deleteAddress = function () {
    var checkboxValue;
    var checkbox = document.getElementsByName("address");
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked === true) {
        checkboxValue = checkbox[i].value;
      }
    }
    if (checkboxValue == null) {
      return;
    } else {
      $http
        .post(url + "/deleteAddress/" + checkboxValue)
        .then(function (response) {
          $scope.deliveryAddress = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  //Chọn địa chỉ
  $scope.checkedAddress = function () {
    var checkboxValue;
    var checkbox = document.getElementsByName("address");
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked === true) {
        checkboxValue = checkbox[i].value;
      }
    }
    if (checkboxValue == null) {
      return;
    } else {
      //Ẩn modal chọn địa chỉ
      $("#modalAddress").modal("hide");
      $scope.checkShip = true;
      //Lấy thông tin địa chỉ đã được chọn người mua
      dataAddress = $http
        .get(url + "/get-oneAddress/" + checkboxValue)
        .then(function (response) {
          $scope.oneAddress = response.data;
          $scope.shopFee();
          //Hiện lại modal đặt hàng
          $("#exampleModal").modal("show");
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  $scope.shopFee = function () {
    Promise.all([dataListProduct, dataAddress]).then(function () {
      var listUserIdStore = [];
      var data = $scope.listProductOrder;
      //Gom sản phẩm có cùng cửa hàng rồi tính tổng các giá trị của sản phẩm
      let aggregatedData = {};
      for (let userId in data) {
        if (data.hasOwnProperty(userId)) {
          listUserIdStore.push(userId);
          for (let i = 0; i < data[userId].length; i++) {
            var currentQuantity = data[userId][i].quantity;
            var currentHeight = data[userId][i].product.height;
            var currentWidth = data[userId][i].product.width;
            var currentWeight = data[userId][i].product.weight;
            var currentLength = data[userId][i].product.length;
            var currentPromotion = data[userId][i].product.promotion;
            var currentOriginalPrice = data[userId][i].product.originalPrice;
            // Nếu userId đã tồn tại trong aggregatedData, cộng thêm quantity vào tổng
            if (aggregatedData.hasOwnProperty(userId)) {
              aggregatedData[userId].totalQuantity += currentQuantity;
              aggregatedData[userId].totalHeight += currentHeight * currentQuantity;
              aggregatedData[userId].totalWidth += currentWidth * currentQuantity;
              aggregatedData[userId].totalWeight += currentWeight * currentQuantity;
              aggregatedData[userId].totalLength += currentLength * currentQuantity;
              aggregatedData[userId].totalPrice +=
                $scope.getSalePrice(currentOriginalPrice, currentPromotion) *
                currentQuantity;
            } else {
              // Nếu userId chưa tồn tại, tạo mới một entry trong aggregatedData
              aggregatedData[userId] = {
                userId: userId,
                totalQuantity: currentQuantity,
                totalHeight: currentHeight * currentQuantity,
                totalWidth: currentWidth * currentQuantity,
                totalWeight: currentWeight * currentQuantity,
                totalLength: currentLength * currentQuantity,
                totalPrice:
                  $scope.getSalePrice(currentOriginalPrice, currentPromotion) *
                  currentQuantity,
              };
            }
          }
        }
      }

      // Chuyển đổi aggregatedData từ đối tượng thành mảng
      var totalData = Object.values(aggregatedData);
      //Lấy danh sách địa chỉ cửa hàng
      $http({
        method: "GET",
        url: url + "/get-listAddress",
        params: { userIds: listUserIdStore }, // Sử dụng params
        headers: { "Content-Type": "application/json" }, // Có thể cần thiết lập header
      })
        .then(function (response) {
          //Gọi hàm gộp mảng và đổ dữ liêu vào
          var mergedArray = $scope.mergeToArray(totalData, response.data);
          $scope.getServiceId(
            mergedArray,
            $scope.oneAddress.districtId,
            $scope.oneAddress.wardCode
          );
        })
        .catch(function (error) {
          // Xử lý error ở đây
        });
    });
  };

  $scope.getServiceId = function (mergedArray, to_district, wardCode) {
    var serviceIdOfUserId = [];
    var promises = [];

    mergedArray.forEach(function (item) {
      var promise = $http({
        method: "POST",
        url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
        headers: {
          Token: token,
        },
        data: {
          shop_id: 4618496,
          from_district: item.districtId,
          to_district: to_district,
        },
      })
        .then(function (response) {
          serviceIdOfUserId.push({
            serviceUser: item.userId,
            serviceId: response.data.data[0].service_id,
            districtId: item.districtId,
            totalHeight: item.totalHeight,
            totalLength: item.totalLength,
            totalPrice: item.totalPrice,
            totalWeight: item.totalWeight,
            totalWidth: item.totalWidth,
          });
        })
        .catch(function (error) {
          console.error("API request failed:", error);
          console.log("Error Object:", error);
        });

      promises.push(promise);
    });

    Promise.all(promises)
      .then(function () {
        // Tất cả các yêu cầu HTTP đã hoàn thành
        $scope.feeShip(serviceIdOfUserId, to_district, wardCode);
      })
      .catch(function (error) {
        // Xử lý lỗi nếu có
        console.error("Promise.all failed:", error);
      });
  };

  $scope.feeShip = function (serviceIdOfUserId, to_district, wardCode) {
    var object = [];
    var promises = [];
    serviceIdOfUserId.forEach(function (item) {
      //Tính phí ship
      var promise = $http({
        method: "POST",
        url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        headers: {
          Token: token,
        },
        data: {
          service_id: item.serviceId,
          insurance_value: item.totalPrice,
          coupon: null,
          from_district_id: item.districtId,
          to_district_id: to_district,
          to_ward_code: wardCode,
          height: Math.round(item.totalHeight),
          length: Math.round(item.totalLength),
          weight: Math.round(item.totalWeight),
          width: Math.round(item.totalWidth),
        },
      })
        .then(function (response) {
          // Xử lý phản hồi thành công
          object.push({
            userId: item.serviceUser,
            total: response.data.data.total,
          });
        })
        .catch(function (error) {
          // Xử lý lỗi
          console.error("API request failed:", error);
          // In ra nội dung đối tượng lỗi
          console.log("Error Object:", error);
        });
      promises.push(promise);
    });
    Promise.all(promises)
      .then(function () {
        // Tất cả các yêu cầu HTTP đã hoàn thành
        $scope.fee = object;
        var sum = 0;
        angular.forEach($scope.fee, function (f) {
          sum += f.total;
        });
        $scope.totalFee = sum;

        $scope.$apply();
      })
      .catch(function (error) {
        // Xử lý lỗi nếu có
        console.error("Promise.all failed:", error);
      });
  };

  //Hàm gọp mảng có cùng userId
  $scope.mergeToArray = function (array1, array2) {
    /// Tạo một đối tượng để theo dõi thông tin của mỗi userId
    let userIdMap = {};

    // Thêm thông tin từ array1 vào userIdMap
    for (let item of array1) {
      userIdMap[item.userId] = userIdMap[item.userId] || {};
      Object.assign(userIdMap[item.userId], item);
    }

    // Gộp thông tin từ array2 vào userIdMap
    for (let item of array2) {
      let userId = item.user.userId;
      userIdMap[userId] = userIdMap[userId] || {};
      Object.assign(userIdMap[userId], item);
    }

    // Kết quả sau khi gộp
    return Object.values(userIdMap);
  };

  $scope.clearForm = function () {
    var inputElement = document.getElementById("phone");
    $scope.selectedDistrict = null;
    $scope.selectedProvince = null;
    $scope.selectedWard = null;
    $scope.textareaValue = "";
    inputElement.value = "";
  }

  $scope.clickStatusPay = function (status) {
    $scope.checkPay = status;
  }

  $scope.paymentVNPay = function (pay) {
    var element = document.getElementById("vnpay");
    var totalFeePay = document.getElementById("totalFeePay");
    var addressPay = document.getElementById("addressPay");
    $scope.payment = element.textContent || element.innerText;
    $scope.totalFeePay = totalFeePay.textContent || totalFeePay.innerText;
    $scope.addressPay = addressPay.textContent || addressPay.innerText;

    // Loại bỏ các ký tự không phải số hoặc dấu chấm
    var numberOnly = $scope.payment.replace(/[^\d]/g, '');

    // Chuyển đổi chuỗi thành số
    var numericValue = parseInt(numberOnly);
    var numericValueFeePay = parseFloat($scope.totalFeePay.replace(/[^\d]/g, ''));
    var addressText = $scope.addressPay.trim();

    if (pay == true) {
      $http.post(url + "/create_payment/" + numericValue)
        .then(function (response) {
          // Lấy URL từ response data
          var newPageUrl = response.data.body;
          // Mở trang mới với URL nhận được
          window.location.href = newPageUrl;
        });
    } else {
      // Lấy tất cả các phần tử input có type là checkbox
      var checkboxes = document.querySelectorAll('input[type="checkbox"]');
      // Lưu giá trị từ các checkbox
      var listColorAndProductId = [];
      // Duyệt qua từng checkbox và kiểm tra xem nó có được chọn và hiển thị không
      checkboxes.forEach(function (checkbox) {
        if (checkbox.checked && checkbox.offsetParent !== null) {
          var productIdAndColor = checkbox.id.split("_");
          var productId = productIdAndColor[0];
          var color = productIdAndColor[1];
          listColorAndProductId.push({ productId: productId, color: color });
        }
      });
      //Thanh toán
      $http({
        method: "POST",
        url: url + "/payShoppingCart/" + numericValue + "/" + addressText + "/" + numericValueFeePay,
        data: listColorAndProductId,
        contentType: "application/json",
      }).then(function (response) {
        Swal.fire({
          position: "top",
          icon: "success",
          text: response.data.body,
          showConfirmButton: false,
          timer: 1000,
        });
        $scope.loadData();
        //Ẩn modal đặt hàng
        $("#exampleModal").modal("hide");
        $location.path('/order/' + $rootScope.myAccount.user.userId);
      })
        .catch(function (error) {
          console.error("Error:", error);
        });
    }

  }

  $scope.reloadPageAfterDelay = function (delayInSeconds) {
    $timeout(function () {
      $window.location.reload();
    }, delayInSeconds * 1000); // Chuyển đổi giây thành mili giây
  };

});
