(function() {
	'use strict';

	var myApp = angular.module('claimeeApp.directives', []);

	angular.module('claimeeApp.directives').directive('fhfooter', function() {
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