angular.module('myApp', ['pascalprecht.translate'])
	.config(function ($translateProvider) {
		$translateProvider.useStaticFilesLoader({
			prefix: '/json/', // Thay đổi đường dẫn này cho phù hợp
			suffix: '.json'
		});
		// Set the default language
		$translateProvider.preferredLanguage('vie');
	})
	.controller('myCtrl', function ($scope, $http, $translate) {
		//Đa ngôn ngữ	
		$scope.changeLanguage = function (langKey) {
			$translate.use(langKey);
		};
	})