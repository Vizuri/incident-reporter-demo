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
		vm.completed = false;

		vm.approvalComments = 'Approval from supervisor app!';
		vm.remediationAccepted = true;
		
		vm.load = load;
		vm.approve = approve;

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
				vm.completed = false;
				
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
				
				if (data["process-instance-variables"]["incidentStatus"]) {
					var processStatus = data["process-instance-variables"]["incidentStatus"];
					$log.info('Status: ', processStatus);
					
					if (processStatus === 'COMPLETED') {
						vm.completed = true;
					}
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

		function approve() {
			var baseUrl = location.protocol + '//' + location.host + '/bpm/kie-server/services/rest/server/';
			$log.info('Approving');
			$http({
				method : 'GET',
				withCredentials : true,
				url : baseUrl + 'queries/tasks/instances/process/'+vm.processId+'?status=Ready',
				headers: {
					   'Accept': 'application/json'
					 }
			}).then(function successCallback(response) {
				var data = response.data;
				var approveTask;
				for (var i = 0; i < data['task-summary'].length; i++) {
					var taskSummary = data['task-summary'][i];
					if (taskSummary['task-status'] === 'Ready' && taskSummary['task-name'] === 'Review Case') {
						approveTask = taskSummary;
						break;
					}
				}
				
				if (approveTask) {
					$http({
						method : 'PUT',
						withCredentials : true,
						url : baseUrl + 'containers/'+vm.containerId+'/tasks/'+approveTask["task-id"]+'/states/completed?auto-progress=true',
						headers: {
							   'Accept': 'application/json',
							   'Content-Type': 'application/json'
							 },
						data: { 'comments' : vm.approvalComments, 'accepted' : vm.remediationAccepted }
					}).then(function successCallback(response) {
						vm.load();
					}, function (error) {
						$log.error('Error calling PUT to approve task');
					});
				}
			}, function errorCallback(error) {
				alert('Error while attempting to approve');
				$log.error('Error loadingImage: ' + error);
			});
		}
		
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