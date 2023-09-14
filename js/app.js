// app.js
angular.module('myApp', [])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    })
    .factory('AuthInterceptor', function ($q, $window) {
        return {
            responseError: function (rejection) {
                if (rejection.status === 403) {
                    // Redirect to the login page
                    $window.location.href = 'login.html';
                }
                return $q.reject(rejection);
            }
        }
    })
    .factory('apiService', function ($http) {
        alert("apiService called");
        // Function to get the JWT token from local storage
        function getJwtToken() {
            // Replace 'YOUR_JWT_TOKEN_KEY' with the key you used to store the token in local storage
            return localStorage.getItem('jwtToken');
        }

        // Function to set the JWT token in the HTTP headers of the API request
        function setAuthorizationHeader() {
            var jwtToken = getJwtToken();
            if (jwtToken) {
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + jwtToken;
            }
        }

        // Function to remove the JWT token from the HTTP headers
        function removeAuthorizationHeader() {
            delete $http.defaults.headers.common['Authorization'];
        }

        // Expose the public methods of the factory
        return {
            setAuthorizationHeader: setAuthorizationHeader,
            removeAuthorizationHeader: removeAuthorizationHeader
        };
    });
