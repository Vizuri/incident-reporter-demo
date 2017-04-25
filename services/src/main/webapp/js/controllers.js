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
			loadVars();
		}

		function loadVars() {
			$log.info('loadVars called');
			$http({
				method : 'GET',
				withCredentials : true,
				url : location.protocol + '//' + location.host + '/bpm/kie-server/services/rest/server/queries/processes/instances/'+vm.processId+'?withVars=true',
				headers: {
					   'Accept': 'application/json'
					 }
			}).then(function successCallback(response) {
				var data = response.data;
				
				vm.comments = [];
				vm.photos = [];
				
				if (data["process-instance-variables"]["incidentPhotoIds"]) {
					var photoIdArr = data["process-instance-variables"]["incidentPhotoIds"];
					photoIdArr = JSON.parse(photoIdArr.replace(/'/g, '"'));
					for (var i = 0; i < photoIdArr.length; i++) {
						var photoName = photoIdArr[i];
						vm.photos.push(location.protocol + '//' + location.host + '/photos/' + vm.processId + '/' + photoName);
					}
				}
				
				if (data["process-instance-variables"]["incidentComments"]) {
					var commentArr = data["process-instance-variables"]["incidentComments"];
					commentArr = JSON.parse(commentArr.replace(/'/g, '"'));
					vm.comments = commentArr;
				} 
				
			}, function errorCallback(error) {
				vm.comments = [];
				vm.photos = [];
				$log.error(error);
			});
		}

		function loadImage() {
			var targetUrl = location.protocol + '//' + location.host + '/bpm/kie-server/services/rest/server/containers/' + vm.containerId + "/images/processes/instances/" + vm.processId;
			$log.info('Calling: ' + targetUrl);
			$http({
				method : 'GET',
				withCredentials : true,
				url : targetUrl
			}).then(function successCallback(response) {
				$log.info('Successful loadImage call: ' + response.status)
				var raw = response.data.substr(response.data.indexOf('svg') - 1);

				var wrapper = document.getElementById('image');
				wrapper.innerHTML = raw;
				
				var svg = document.getElementsByTagName('svg')[0];
				
				svg.setAttribute('width', '900px');
				svg.setAttribute('height', '600px');
				svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
				svg.setAttribute('viewBox', '5 275 1500 500');
				
			}, function errorCallback(error) {
				var wrapper = document.getElementById('image');
				wrapper.innerHTML = '<i>No process image found</i>';
				$log.error('Error loadingImage: ' + error);
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