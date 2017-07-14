(function() {
	'use strict';

	angular.module('adjustorApp.controllers', [ 'fhcloud', 'ngCordova' ]);

	angular.module('adjustorApp.controllers').controller('ExistingClaimController', existingClaimController).controller('ClaimDetailController', claimDetailController).controller('AdjustClaimController', adjustClaimController);

	function existingClaimController($log, $timeout, $state, $rootScope, $location) {

	    $log.info('Inside Adjustor:existingClaimController');
		var vm = this;

		vm.loadClaimDetails = loadClaimDetails;

		function loadClaimDetails(claim) {

      $log.info("Inside existingClaimController:loadClaimDetails");
			$log.info("Found claim: ", claim);
			if (claim) {
				$rootScope.claim = claim;
			}

             $state.go("claimdetails"); // OR $location.path('claimdetails');
		}

		function loadClaims() {
			$log.info("Inside claimsController:loadClaims");

			feedhenry.cloud({
				path : '/v1/api/claims',
				method : 'GET',
				contentType : 'application/json'
			}, function(response) {
				$timeout(function() {
        	$log.info("got Claims: ", response);
					vm.claims = response;
					vm.claimCount = 0;

					if (vm.claims != null || vm.claims != undefined){
                vm.claims.forEach(function(claim) {
                    vm.claimCount++;
                    // lets fix the comments
                    if (claim.incidentComments && claim.incidentComments.length > 0) {
                        claim.comments = [];
                        claim.incidentComments.forEach(function(c, i) {
                        	claim.comments.push({message: c});
                        });
                    }
                });
                $log.info("found " + vm.claimCount + " existing Claim(s)");
					}
					else {
                $log.info("no existing Claims");
					}

				});
			}, function(message, error) {
				$log.info("loadClaims: " + message);
				$log.error(error);
			});
		}

		loadClaims();
	}

	function claimDetailController($log, $location, $rootScope, $timeout, $ionicPlatform, $cordovaCamera, FHCObjectScrubber) {
		$log.info('Inside Adjuststor:ClaimDetailController');
		var vm = this;

		vm.answers = {};
		vm.hasClaim = false;
		vm.showUploadSpinner = false;
		var ready = false;

		vm.approveClaim = approveClaim;
		vm.takePhoto = takePhoto;
		vm.updateClaim = updateClaim;
		vm.saveComment = saveComment;

		function loadClaim() {
			$log.info('Inside claimDetailController:loadClaim');

			if ($rootScope.claim) {
				vm.claim = $rootScope.claim;
				vm.claim.questionnaire.answers.forEach(function(ans){
						vm.answers[ans.questionId] = ans;
				});
				vm.hasClaim = true;
			} else {
				$location.path('/');
			}
		}

		function saveComment() {

      $log.info("Inside saveComment: ", vm.comment);

      if (vm.comment) {
				feedhenry.cloud({
					path : '/api/v1/bpms/add-comments/' + vm.claim.processId,
					method : 'POST',
					contentType : 'application/json',
					data : {
						claimComments : vm.comment,
						messageSource : 'responder'
					}
				});

        $log.info("done saving Comment: ", vm.comment);

				if (!vm.claim.comments) {
					vm.claim.comments = [];
				}
				vm.claim.comments.push({
					message : vm.comment,
					title : '',
					commenterName : '',
					commentDate : new Date()
				});
				vm.comment = '';
			}
		}

		function takePhoto(pictureSourceId) {
			$log.info("Inside takePhoto, pictureSourceId: " + pictureSourceId);

			if (ready) {
				vm.showUploadSpinner = true;
				var options = {
					quality : 100,
					destinationType : Camera.DestinationType.FILE_URI,
					sourceType : pictureSourceId,
					correctOrientation: true,
					encodingType : 0
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					var imageUri = imageData;
					if (imageUri) {
						sendPhoto(imageUri);
						$cordovaCamera.cleanup(function() {
							$log.info('Cleanup Sucesss');
						}, function() {
							$log.info('Cleanup Failure');
						});
					} else {
						$log.error("ImageUri not retrieved from camera!");
					}
					vm.showUploadSpinner = false;
				}, function(err) {
					$log.info('Error');
					vm.showUploadSpinner = false;
				});
			} else {
				$log.info('Not ready for pictures!');
			}
		}

		function sendPhoto(imageUri) {
      $log.info("Inside sendPhoto, imageUri: " + imageUri);
			var url = $fh.getCloudURL();

			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = imageUri.substr(imageUri.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";

			var ft = new FileTransfer();
			ft.upload(imageUri, encodeURI(url + '/api/v1/bpms/upload-photo/' + vm.claim.processId + '/' + options.fileName+ '/responder'), function(success) {
				var responseData = JSON.parse(success.response);
				var link = responseData.link;

				$rootScope.$apply(function() {
						$log.info("Scope apply for link: " + link);
						if (!vm.claim.photos) {
							vm.claim.photos = [];
						}
						vm.claim.photos.push(link);
				});
				vm.showUploadSpinner = false;
			}, function(error) {
				vm.showUploadSpinner = false;
				$log.error(error);
			}, options);
		}

		function approveClaim() {
      $log.info('Inside claimDetailController:approveClaim');

			if (vm.claim && vm.claim.processId) {
				vm.claim.approved = true;
				updateClaim(vm.claim);
			}
		}

		function updateClaim(claim) {

    	$log.info('Inside updateClaim');

			if (claim) {
				// Clean out any angular $resource metadata
				FHCObjectScrubber.cleanObject(claim.questionnaire);
				FHCObjectScrubber.cleanObject(claim.incident);
				// POST to the could endpoint
				feedhenry.cloud({
					path : '/v1/api/claim',
					method : 'PUT',
					contentType : 'application/json',
					data : claim
				}, function(response) {
					// Track the DB id for updates
					vm.claim.id = response.guid;
				}, function(message, error) {
					$log.info(message);
					$log.error(error);
				});
			}
		}

		loadClaim();

		$ionicPlatform.ready(function() {
			$log.info('ready');
			ready = true;
		});

	}

	function adjustClaimController($log, $timeout, $state, $location, $rootScope, FHCObjectScrubber) {
		$log.info('Inside Adjuststor:AdjustClaimController');
		var vm = this;

		var task = {
			task_complete : false,
			task_adjustedAmount : '',
			task_approved : false,
			task_comment : ''
		};

		vm.adjust = adjust;
		vm.deny = deny;
		vm.incompleteClaim = incompleteClaim;
		vm.completeClaim = completeClaim;

		function adjust(complete, cb) {

            $log.info('Inside adjustClaimController:adjust');

			// if (vm.adjustedValue) {
			// 	task.task_adjustedAmount = parseFloat(vm.adjustedValue);
			// }
			// task.task_comment = vm.comment;

			feedhenry.cloud({
				path : '/api/v1/bpms/doadjuster/' + vm.claim.processId + '/' + complete,
				method : 'POST',
				contentType : 'application/json'
				//,data : task
			}, function(response) {
                $log.info('adjust complete');
                cb();
            }, function(message, error) {
                $log.info(message);
                $log.error(error);
                cb(error);
            });

		}

		function completeClaim() {
            $log.info('Inside adjustClaimController:completeClaim');

			task.task_complete = true;
			task.task_approved = true;
			vm.claim.approved = true;
			vm.claim.questionnaire.completedDate = new Date();
			vm.claim.questionnaire.completedBy = 'tester';
			updateClaim(vm.claim);
			adjust(true, function(error){

                $log.info('approved, going to claims');
                //$location.path('claims');
			    //$location.url("/claims");
                //window.location.href = "#/claims";
                $state.go('claims');
            });
		}

		function incompleteClaim() {

            $log.info('Inside incompleteClaim');

			task.task_complete = false;
			task.task_approved = false;

			adjust(false, function(error){

                $log.info('incomplete, going to claims');
                //$location.path('claims');
                //$location.url("/claims");
                //window.location.href = "#/claims";
                $state.go('claims');

            });

            $log.info('return');
			return true;
		}

        function deny() {
            $log.info('Inside adjustClaimController:deny');
            task.task_complete = true;
            task.task_approved = false;
            vm.claim.approved = false;
            vm.claim.questionnaire.completedDate = new Date();
            vm.claim.questionnaire.completedBy = 'tester';
            updateClaim(vm.claim);
            adjust();
        }

		function loadClaim() {
            $log.info('Inside adjustClaimController:loadClaim');
			if ($rootScope.claim) {
				vm.claim = $rootScope.claim;
				if (vm.claim.adjustedValue) {
					vm.showAdjustedValue = true;
				}
				vm.hasClaim = true;
			} else {
				$location.path('/');
			}
		}

		function updateClaim(claim) {

            $log.info('Inside adjustClaimController:updateClaim');
			if (claim) {
				// Clean out any angular $resource metadata
				FHCObjectScrubber.cleanObject(claim.questionnaire);
				FHCObjectScrubber.cleanObject(claim.incident);
				// POST to the could endpoint
				feedhenry.cloud({
					path : '/v1/api/claim',
					method : 'PUT',
					contentType : 'application/json',
					data : claim
				}, function(response) {
					// Track the DB id for updates
					vm.claim.id = response.guid;
				}, function(message, error) {
					$log.info(message);
					$log.error(error);
				});
			}
		}

		loadClaim();

	}

})();
