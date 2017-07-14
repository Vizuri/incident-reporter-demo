(function () {
    'use strict';

    angular.module('claimeeApp.controllers', ['fhcloud', 'ngCordova']);

    angular.module('claimeeApp.controllers').controller('ClaimsController', claimsController).controller('NewClaimController', newClaimController).controller('ClaimDetailController', claimDetailController);

    function claimsController($log, $rootScope, $timeout) {
        $log.info('Inside Claimee:ClaimsController');
        var vm = this;

        vm.loadClaimDetails = loadClaimDetails;

        function loadClaimDetails(claim) {
            $log.info('Inside claimsController:loadClaimDetails');
            $log.info("Found claim: ", claim);
            if (claim) {
                $rootScope.claim = claim;
            }
        }

        function loadClaims() {
            $log.info("Inside claimsController:loadClaims");

            feedhenry.cloud({
                path: '/v1/api/claims',
                method: 'GET',
                contentType: 'application/json'
            }, function (response) {
                $timeout(function () {
                    $log.info("got Claims: ", response);
                    vm.claims = response;
                    vm.claimCount = 0;

                    if (vm.claims != null || vm.claims != undefined) {
                        vm.claims.forEach(function (claim) {
                            vm.claimCount++;

                            // lets fix the comments
                            if (claim.incidentComments && claim.incidentComments.length > 0) {
                                claim.comments = [];
                                claim.incidentComments.forEach(function (c, i) {
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
            }, function (message, error) {
                $log.info("loadClaims: " + message);
                $log.error(error);
            });
        }

        loadClaims();
    }

    function newClaimController($log, $timeout, $location, $filter, $rootScope, FHCObjectScrubber, UUID, States) {
        $log.info('Inside Claimee:NewClaimController');
        var vm = this;

        vm.severities = ['LOW', 'MEDIUM', 'HIGH'];
        vm.incidentDate = $filter("date")(Date.now(), 'yyyy-MM-dd');
        vm.severity = 'LOW';

        vm.showIncident = true;
        vm.showQuestions = false;
        vm.incidentTypes = ["windshield", "collision", "hail"];
        vm.states = States;
        vm.claim = {
            id: 0,
            processId: 0,
            incident: {
                id: null,
                reporterUserId: 99,
                type: null,
                description: null,
                incidentDate: null,
                buildingName: null,
                stateCode: null,
                zipCode: null,
                severity: null
            },
            customer: null,
            questionnaires: [],
            photos: [],
            approved: null,
            statedValue: null,
            comments: []
        };

        vm.finishIncident = finishIncident;
        vm.submitIncident = submitIncident;
        vm.updateAnswers = updateAnswers;

        function saveClaim(claim) {
            $log.info("Inside saveClaim, claim: ", claim);

            // If there is a claim persist it to the DB
            if (claim) {
                // Clean out any angular $resource metadata
                FHCObjectScrubber.cleanObject(claim.questionnaire);
                FHCObjectScrubber.cleanObject(claim.incident);
                claim.questionnaire.questions.forEach(function (elt, i) {
                    FHCObjectScrubber.cleanObject(elt);
                });
                // POST to the could endpoint
                feedhenry.cloud({
                    path: '/v1/api/claim',
                    method: 'POST',
                    contentType: 'application/json',
                    data: claim
                }, function (response) {
                    // Track the DB id for updates
                    vm.claim.id = response.guid;
                    updateClaim(claim);
                }, function (message, error) {
                    $log.info(message);
                    $log.error(error);
                });
            }
        }

        function updateClaim(claim) {
            $log.info("Inside newClaimController:updateClaim, claim: ", claim);

            if (claim) {
                // Clean out any angular $resource metadata
                FHCObjectScrubber.cleanObject(claim.questionnaire);
                FHCObjectScrubber.cleanObject(claim.incident);
                claim.questionnaire.questions.forEach(function (elt, i) {
                    FHCObjectScrubber.cleanObject(elt);
                });
                // POST to the cloud endpoint
                feedhenry.cloud({
                    path: '/v1/api/claim',
                    method: 'PUT',
                    contentType: 'application/json',
                    data: claim
                }, function (response) {
                    // Track the DB id for updates
                    vm.claim.id = response.guid;
                }, function (message, error) {
                    $log.info(message);
                    $log.error(error);
                });
            }
        }

        function updateAnswers() {
            $log.info("Inside updateAnswers");

            var answers = [];
            vm.claim.questionnaire.questions.forEach(function (elt, i) {
                $log.info("check answer for question[" + elt.questionId + "], enabled[" + elt.enabled + "]");
                if (!vm.answers[i]) {
                    if (elt.answerType === 'YES_NO') {
                        vm.answers[i] = false;
                    } else {
                        vm.answers[i] = '';
                    }
                }
            });

            vm.answers.forEach(function (elt, i) {
                var answer = {};
                answer.questionId = vm.claim.questionnaire.questions[i].questionId;
                $log.info("check answer[" + elt.questionId + "], value[" + elt.strValue + "]", elt);

                if (elt === true) {
                    answer.strValue = 'Yes';
                } else if (elt === false) {
                    answer.strValue = 'No';
                } else {
                    answer.strValue = elt;
                }

                $log.info("save answer: ", answer);
                answers.push(answer);
            });

            $log.info("answers: ", answers);

            vm.claim.questionnaire.answers = answers;

            if (vm.claim.questionnaire.answers.length > 0) {

                $log.info("clean questionnaire");

                FHCObjectScrubber.cleanObject(vm.claim.questionnaire);

                vm.claim.questionnaire.questions.forEach(function (elt, i) {
                    FHCObjectScrubber.cleanObject(elt);
                });

                $log.info("questionnaire: ", vm.claim.questionnaire);

                feedhenry.cloud({
                    path: '/api/v1/bpms/update-questions',
                    method: 'POST',
                    contentType: 'application/json',
                    data: vm.claim.questionnaire
                }, function (response) {
                    $timeout(function () {
                        vm.claim.questionnaire = response;
                        vm.claim.questionnaire.questions.forEach(function (elt) {
                            $log.info("question[" + elt.questionId + "], enabled: " + elt.enabled);
                        });

                    });
                }, function (message, error) {
                    $log.info(message);
                    $log.error(error);
                });
            }
        }

        function finishIncident() {
            $log.info("Inside finishIncident");

            if (vm.claim && vm.claim.incident) {
                feedhenry.cloud({
                    path: '/api/v1/bpms/startprocess',
                    method: 'POST',
                    contentType: 'application/json',
                    data: {
                        //claimedAmount: vm.claim.statedValue
                        claim: vm.claim
                    }
                }, function (response) {
                    $timeout(function () {
                        vm.claim.processId = response; // Track claim by processId
                        delete vm.claim.incident.$$hashKey;
                        saveClaim(vm.claim);
                        $timeout(function () {
                            $location.path('/claims');
                        }, 1000, true);
                    }, 0, true, response);
                }, function (message, error) {
                    $log.info(message);
                    $log.error(error);
                });
            }
        }

        function submitIncident() {
            $log.info("Inside submitIncident");

            vm.claim.incident.id = Math.round(Math.random() * 1000) + 1;
            vm.claim.incident.type = vm.incidentType;
            vm.claim.incident.description = vm.description;
            vm.claim.incident.incidentDate = vm.incidentDate;
            vm.claim.incident.buildingName = vm.buildingName;
            vm.claim.incident.stateCode = vm.stateCode;
            vm.claim.incident.zipCode = vm.zipCode;
            vm.claim.incident.severity = vm.severity;

            feedhenry.cloud({
                path: '/api/v1/bpms/customer-incident',
                method: 'POST',
                contentType: 'application/json',
                data: vm.claim.incident
            }, function (response) {
                $log.info("Got questionnaire: ", response);
                $timeout(function () {
                    vm.claim.questionnaire = response;
                    vm.answers = [];
                    vm.showIncident = false;
                    vm.showQuestions = true;
                });
            }, function (message, error) {
                $log.info("Found error: ", message);
                $log.error(error);
            });
        }

    }

    function claimDetailController($http, $log, $location, $rootScope, $timeout, $ionicPlatform, $cordovaCamera, FHCObjectScrubber) {

        $log.info('Inside Claimee:ClaimDetailController');
        var vm = this;

        vm.answers = {};
        vm.hasClaim = false;
        vm.showUploadSpinner = false;
        var ready = false;

        vm.saveComment = saveComment;
        vm.takePhoto = takePhoto;

        function loadClaim() {
            $log.info("Inside claimDetailController:loadClaim");

            if ($rootScope.claim) {
                vm.claim = $rootScope.claim;
                vm.claim.questionnaire.answers.forEach(function(ans){
                    vm.answers[ans.questionId] = ans;
                });
                vm.hasClaim = true;
            } else {
                $location.path('/claims');
            }
        }

        function saveComment() {

            $log.info("Inside saveComment: ", vm.comment);

            if (vm.comment) {
                feedhenry.cloud({
                    path: '/api/v1/bpms/add-comments/' + vm.claim.processId,
                    method: 'POST',
                    contentType: 'application/json',
                    data: {
                        claimComments: vm.comment,
                        messageSource: 'reporter'
                    }
                });

                $log.info("done saving Comment: ", vm.comment);

                if (!vm.claim.comments) {
                    vm.claim.comments = [];
                }
                vm.claim.comments.push({
                    message: vm.comment,
                    title: '',
                    commenterName: '',
                    commentDate: new Date()
                });
                vm.comment = '';
            }
        }

        function takePhoto(pictureSourceId) {
            $log.info("Inside takePhoto, pictureSourceId: " + pictureSourceId);

            if (ready) {
                vm.showUploadSpinner = true;
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: pictureSourceId,
                    correctOrientation: true,
                    encodingType: 0
                };
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    var imageUri = imageData;
                    if (imageUri) {
                        sendPhoto(imageUri);
                        $cordovaCamera.cleanup(function () {
                            $log.info('Cleanup Sucesss');
                        }, function () {
                            $log.info('Cleanup Failure');
                        });
                    } else {
                        $log.error("ImageUri not retrieved from camera!");
                    }
                    vm.showUploadSpinner = false;
                }, function (err) {
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
            ft.upload(imageUri, encodeURI(url + '/api/v1/bpms/upload-photo/' + vm.claim.processId + '/' + options.fileName + '/reporter'), function (success) {
                var responseData = JSON.parse(success.response);
                var link = responseData.link;

                $rootScope.$apply(function () {
                    $log.info("Scope apply for link: " + link);
                    if (!vm.claim.photos) {
                        vm.claim.photos = [];
                    }
                    vm.claim.photos.push(link);
                });
                vm.showUploadSpinner = false;
            }, function (error) {
                vm.showUploadSpinner = false;
                $log.error(error);
            }, options);
        }

        loadClaim();

        $ionicPlatform.ready(function () {
            $log.info('ready');
            ready = true;
        });

    }

})();
