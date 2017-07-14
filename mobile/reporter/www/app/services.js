(function() {
	'use strict';

	angular.module('claimeeApp.services', []);

	angular.module('claimeeApp.services')
	.constant('States', ['VA', 'NM'])
	.service('FHCObjectScrubber', function() {
		return {
			cleanObject : function cleanObject(object) {
				delete object.$promise;
				delete object.$resolved;
				delete object.$$hashKey;
				delete object.__fh;
				delete object.__proto__;
			}
		};
	})
	.factory('UUID', function() {
		function guid() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}
		return guid();
	});

})();
