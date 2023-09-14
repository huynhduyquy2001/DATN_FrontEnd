
app.controller('MyStoreController', function ($scope, $http, $translate, $rootScope, $location) {
    if (!$location.path().startsWith('/profile/')) {
        // Tạo phần tử link stylesheet
        var styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = '/css/style.css';

        // Thêm phần tử link vào thẻ <head>
        document.head.appendChild(styleLink);
    }
});