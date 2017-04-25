(function() {
	'use strict';

	angular.module('bpmsFlowApp', [ 'bpmsFlowApp.controllers' ]);

	angular.module('bpmsFlowApp').config([ '$httpProvider', function($httpProvider) {
		$httpProvider.defaults.headers.common['Authorization'] = 'Basic cHJvY2Vzc29yOnByb2Nlc3NvciM5OQ==';
	} ]);

})();