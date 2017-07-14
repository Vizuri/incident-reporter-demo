(function() {
	'use strict';

	angular.module('claimeeApp', [ 'ionic', 'ui.router', 'ngSanitize', 'ngResource', 'claimeeApp.controllers', 'claimeeApp.directives', 'claimeeApp.services', 'claimeeApp.filters', 'fhcloud' ]);

	angular.module('claimeeApp').run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
			document.addEventListener('deviceready', function () {
				$fh.push((function(event) {
					alert(event.alert || event.message);
				}), (function() {
					console.log("notification success: ", event.message);
				}), function(error) {
					console.log("notification error: " + error);
				});
			}, false);
		});
	}).config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/landing');
		$stateProvider.state('landing', {
			url : '/landing',
			templateUrl : 'views/landing.html'
		}).state('claims', {
			url : '/claims',
			templateUrl : 'views/existingclaims.html',
			controller : 'ClaimsController as vm'
		}).state('newclaim', {
			url : '/newclaim',
			templateUrl : 'views/newclaim.html',
			controller : 'NewClaimController as vm',
		}).state('claimdetails', {
			url : '/claimdetails',
			templateUrl : 'views/claimdetails.html',
			controller : 'ClaimDetailController as vm',
		});
	});

})();
