
app.controller('ShoppingCartController', function ($scope, $http) {
	var url = "http://localhost:8080";
	$scope.listProduct = [];

	$http.get(url + '/get-product-shoppingcart').then(function (response) {
		$scope.listProduct = response.data;
	}).catch(function (error) {
		console.error('Lỗi khi lấy dữ liệu:', error);
	});

	//tính giá khuyếb mãi
	$scope.getSalePrice = function (originalPrice, promotion) {
		if (promotion === 0) {
			return originalPrice;
		} else {
			//tính tổng số lượng các đánh giá
			var SalePrice = originalPrice - (originalPrice * promotion / 100);
			return SalePrice;
		}
	}

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
		return $scope.getSalePrice(product.product.originalPrice, product.product.promotion) * product.quantity;
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

		$http.post(url + "/add-to-cart", formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(function (res) {
			// Xử lý phản hồi từ máy chủ
		});
	}

	//Hàm giảm số lượng trong giỏ hàng
	$scope.minusQuantity = function (product, quantity) {
		//giảm số lượng trong giỏ hàng
		var formData = new FormData();
		formData.append("productId", product.product.productId);
		formData.append("quantity", quantity);
		formData.append("color", product.color);

		$http.post(url + "/minusQuantity-to-cart", formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(function (res) {
			// Xử lý phản hồi từ máy chủ
		});
	}

	//Hàm thêm số lượng vào giỏ hàng
	$scope.setQuantity = function (product, quantity) {
		//thêm số lượng vào giỏ hàng
		var formData = new FormData();
		formData.append("productId", product.product.productId);
		formData.append("quantity", quantity);
		formData.append("color", product.color);

		$http.post(url + "/setQuantity-to-cart", formData, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(function (res) {
			// Xử lý phản hồi từ máy chủ
		});
	}

	//gom những sản phẩm lại chung khi cùng shop
	$scope.groupProducts = function (listProduct) {
		var grouped = {};
		angular.forEach(listProduct, function (product) {
			var userId = product.product.user.userId;
			if (!grouped[userId]) {
				grouped[userId] = [];
			}
			grouped[userId].push(product);
		});
		return grouped;
	};
});