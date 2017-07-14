(function() {
	'use strict';

	angular.module('adjustorApp.directives', []);

	angular.module('adjustorApp.directives').directive('fhfooter', function() {
		return {
			scope : {},
			restrict : 'E',
			replace : true,
			templateUrl : 'views/components/footer.html',
			link : function(scope, elem, attrs, ctrl) {
				scope.version = attrs.version;
			}
		};
	});

})();