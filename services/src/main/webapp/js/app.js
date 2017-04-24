(function() {
	'use strict';

	angular.module('bpmsFlowApp', [ 'bpmsFlowApp.controllers' ]);

	angular.module('bpmsFlowApp').config([ '$httpProvider', function($httpProvider) {
		$httpProvider.defaults.headers.common['Authorization'] = 'Basic ZGVjaWRlcjpkZWNpZGVyIzk5';
	} ]);

})();