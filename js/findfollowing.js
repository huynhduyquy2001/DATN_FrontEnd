angular.module('myApp', [])
    .controller('myCtrl', function ($scope, $http) {
        $http.get('/findfollowing')
            .then(function (response) {
                var Posts = response.data;
                $scope.Posts = Posts;
            })
            .catch(function (error) {
                console.log(error);
            });
    });