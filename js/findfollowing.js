angular.module('myApp', [])
    .controller('myCtrl', function ($scope, $http) {
        $http.get('http://localhost:8080/findfollowing')
            .then(function (response) {
                var Posts = response.data;
                $scope.Posts = Posts;
            })
            .catch(function (error) {
                console.log(error);
            });
    });