(function() {
	'use strict';

	angular.module('bpmsFlowApp.controllers', []);

	angular.module('bpmsFlowApp.controllers').controller('MainController', mainController);

	function mainController($log, $http, $interval) {
		$log.info('Inside MainController');
		var vm = this;

		vm.processId = '1'; // Default processId
		vm.containerId = 'IncidentProcessorContainer'; // Default containerId
		vm.comments = [];
		vm.photos = [];
		vm.updateCount = 0;
		vm.autoUpdate = false;

		vm.load = load;

		function load() {
			loadImage();
			loadComments();
			loadVars();
		}

		function loadVars() {
			$log.info('loadVars not implemented yet');
			/*$http({
				method : 'GET',
				withCredentials : true,
				url : location.protocol + '//' + location.host + '/business-central/rest/runtime/com.redhat.vizuri.insurance:mobile-claims-bpm:1.0-SNAPSHOT/withvars/process/instance/' + vm.processId
			}).then(function(response) {
				var xml = response.data;
				var x2js = new X2JS();
				var document = x2js.xml2js(xml);
				var rx = /^photo[0-9]?$/m;
				var vars = document['process-instance-with-vars-response'].variables.entry;
				vm.photos = [];
				for (var i = 0; i < vars.length; i++) {
					if (rx.test(vars[i].key)) {
						$log.info('Matched this key for photo: ' + vars[i].key);
						vm.photos.push(location.protocol + '//' + location.host + '/summit-service/rest/vizuri/summit/download-photo/' + vm.processId + '/' + vars[i].value.substr(vars[i].value.indexOf('content=') + 8));
					}
				}
			}, function(error) {
				$log.error(error);
			});*/
		}

		function loadComments() {
			$log.info('loadComments not implemented yet');
			/*$http({
				method : 'GET',
				headers : {
					accept : 'application/json'
				},
				withCredentials : true,
				url : location.protocol + '//' + location.host + '/business-central/rest/runtime/com.redhat.vizuri.insurance:mobile-claims-bpm:1.0-SNAPSHOT/process/instance/' + vm.processId + '/variable/claimComments'
			}).then(function(response) {
				vm.comments = response.data;
			}, function(error) {
				$log.error(error);
			});*/
		}

		function loadImage() {
			var targetUrl = location.protocol + '//' + location.host + '/bpm/kie-server/services/rest/server/containers/' + vm.containerId + "/images/processes/instances/" + vm.processId;
			$log.info('Calling: ' + targetUrl);
			$http({
				method : 'GET',
				withCredentials : true,
				url : targetUrl
			}).then(function(response) {
				var raw = response.data.substr(response.data.indexOf('svg') - 1);

				var wrapper = document.getElementById('image');
				wrapper.innerHTML = raw;
				
				var svg = document.getElementsByTagName('svg')[0];
				
				svg.setAttribute('width', '808px');
				svg.setAttribute('height', '630px');
				svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
				svg.setAttribute('viewBox', '140 40 1212 945');
				
			}, function(error) {
				$log.error(error);
			});
		}

		//load();

		$interval(function() {
			if (vm.autoUpdate) {
				$log.info('Updating...');
				load();
				vm.updateCount++;
				if (vm.updateCount > 20) {
					vm.updateCount = 0;
					vm.autoUpdate = false;
				}
			}
		}, 10000);

	}

})();