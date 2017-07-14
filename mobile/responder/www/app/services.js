(function() {
	'use strict';

	angular.module('adjustorApp.services', []);

	angular.module('adjustorApp.services')
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

})();