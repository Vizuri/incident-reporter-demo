
var request = require('request');
var http = require('http');

var PROCESS_SERVER_HOST = process.env.PROCESS_SERVER_HOST || 'localhost:8080';
var CONTAINER_ID = process.env.PROCESS_CONTAINER_ID || 'ProcessContainer';
var BASIC_AUTH = process.env.PROCESS_BASIC_AUTH || 'Basic cHJvY2Vzc29yOnByb2Nlc3NvciM5OQ==';
var SERVICES_SERVER_HOST = process.env.SERVICES_SERVER_HOST || 'localhost:8080';

exports.getExistingClaims = function (req, res){

    console.log("Inside getExistingClaims");

    if (req.body) {

        var options = {
            url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/queries/processes/instances?status=1',
            headers: {
                'Accept': 'application/json',
                'Authorization': BASIC_AUTH
            },
            method: 'GET'
        };

        //send request
        request(options, function (error, response, body) {
            //console.log("BODY: ", body);
            if (!error && response.statusCode == 200) {
                //var data = JSON.parse(JSON.stringify(body));

                var existingClaims = [];
                var claimCount = 0;
                var processes =  JSON.parse(body)["process-instance"];
                var processCount = processes.length;


                //console.log("processes: ", processes );

                if (processes){

                    processes.forEach(function(process) {

                        loadClaimDetails(process, function(claim) {

                            //console.log("found claim: ", claim);
                            claimCount++;

                            if (claim != null || claim != undefined){

                                console.log("add claim: ", claim.questionnaire.id );

                                claim.photos = [];
                                // lets fix the photos
                                if (claim.incidentPhotoIds && claim.incidentPhotoIds.length > 0) {
                                    claim.incidentPhotoIds.forEach(function (p, i) {
                                        var link = 'http://' + SERVICES_SERVER_HOST + '/photos/' + claim.processId + '/' + p.replace(/'/g, '');
                                        claim.photos.push(link);
                                    });
                                }

                                existingClaims.push(claim);
                            }

                            if (claimCount === processCount){
                                return res.json(existingClaims);
                            }
                        });



                    });
                }
                else{
                    console.log("No claims found");
                }


            }
            else {
                console.error("got an error: ", error);

                return res.status(500).json({error : 'DB record retreival error!'});
            }
        });

    }
};


function loadClaimDetails(process, cb) {

    console.log("Inside loadClaimDetails);  // from process: ", process);

    var instanceId = process[["process-instance-id"]];

    console.log("found process["+instanceId+"]");

    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/containers/' + CONTAINER_ID + '/processes/instances/' + instanceId + '/variables',
        headers: {
            'Accept': 'application/json',
            'Authorization': BASIC_AUTH
        },
        method: 'GET'
    };

    //send request
    request(options, function (error, response, body) {

        console.log("Process claims body: ", body);
        //console.log("response: ", response);

        if (!error && response.statusCode == 200) {

            var claim = JSON.parse(body);
            claim.processId = instanceId;
            console.log("found claim details for instanceId: " + instanceId);
            cb(claim);
        }
        else {
            console.error("got an error: ", error);

            cb(null);
        }
    });

};


exports.startProcess = function (req, res){

    console.log("Inside startProcess");

    var claim = req.body.claim;
    var incident = claim.incident;

    console.log("claim: ", claim);  // + JSON.stringify(claim, 2, null));

    var incident = {"com.redhat.vizuri.demo.domain.Incident":{
                            "id" : incident.id,
                            "reporterUserId" : incident.reporterUserId,
                            "incidentType" : incident.type,
                            "description" : incident.description,
                            "incidentDate" : incident.incidentDate,
                            "buildingName" : incident.buildingName,
                            "stateCode" : incident.stateCode,
                            "zipCode" : incident.zipCode,
                            "severity" : incident.severity
                        }
                   };



    var questionnaire = {"com.redhat.vizuri.demo.domain.Questionnaire": {
                                "id": 1,
                                "name": claim.questionnaire.name,
                                "questions": [],
                                "answers": [],
                                "completedBy": null,
                                "completedDate": null
                            }
                        };

    var questionTemplate = {"questionId": "win-1",
                            "questionnaireId": 1,
                            "groupId": null,
                            "description": "Is the crack larger than a quarter?",
                            "answerType": "YES_NO",
                            "required": false,
                            "enabled": true,
                            "order": 1,
                            "options": []
                        };

    var answerTemplate =  {"questionId" : "win-1",
                           "groupId" : null,
                           "strValue" : "No"
                          };

    var question;
    var answer;
    // now create new instances of questions
    claim.questionnaire.questions.forEach(function(q, i){

        question = JSON.parse(JSON.stringify(questionTemplate));

        question.questionId = q.questionId;
        question.description = q.description;
        question.enabled = q.enabled;
        question.order = q.order;

        console.log("add question["+ question.questionId+"], enabled["+question.enabled+"]");  // compact log
        //console.log("add question: " + JSON.stringify(question, null, 2) );
        questionnaire["com.redhat.vizuri.demo.domain.Questionnaire"].questions.push(question);

    });

    claim.questionnaire.answers.forEach(function(a, i){


        answer = JSON.parse(JSON.stringify(answerTemplate));

        answer.questionId = a.questionId;
        answer.strValue = a.strValue;

        console.log("add answer["+ answer.questionId+"], value["+answer.strValue+"]");  // compact log
        //console.log("add answer: " + JSON.stringify(answer, null, 2));    // detail log
        questionnaire["com.redhat.vizuri.demo.domain.Questionnaire"].answers.push(answer);

    });

    var msg = {
        "incident" : incident,
        "questionnaire": questionnaire
    };


    //console.log("msg: ", msg);
    console.log("msg: " +  JSON.stringify(msg, null, 2));


    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/containers/' + CONTAINER_ID + '/processes/processes.report-incident/instances',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': BASIC_AUTH
        },
        method: 'POST',
        json: msg
    };

    //send request
    request(options, function (error, response, body) {
        //console.log("BODY: ", body);
        console.log("response.statusCode: ", response.statusCode);
        if (!error && response.statusCode == 201) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("StartDATA: ", data);
            return res.json(body);
        }
        else {
            console.error('Error happened: '+ error);
            res.json(error);
        }
    });

};

exports.addPhoto = function (instanceId, fileName, source, cb){

    console.log("Inside addPhoto");

    var updateInfo = {"photoId" : fileName,
                      "updateSource" : source};


    console.log("for instanceId[" + instanceId + "], updateInfo: ", updateInfo);

    signalHumanTask(instanceId, "Update%20Information", function(error){

        if (!error){

            listReadyTasks (instanceId, "Update Information", function(error, taskId){

                if (!error){

                    console.log("calling updateInformation");
                    updateInformation (taskId, updateInfo, function(error){

                        if (!error){
                            console.log("Claim updated successful");
                            cb(null, "SUCCESS");

                        }
                        else{
                            var msg = "Unable to add photo, error: " + error;
                            console.error(msg);
                            cb(msg);
                        }
                    });

                }
                else{
                    var msg = "Unable to list ready tasks, error: " + error;
                    console.error(msg);
                    cb(msg);
                }

            });
        }
        else{
            var msg = "Unable to signal for human task, error: " + error;
            console.error(msg);
            cb(msg);
        }

    });

};

exports.addComment = function (req, res){

    console.log("Inside addComment");

    var body = req.body;

    //console.log("body: ", body);

    var instanceId = req.params.instanceId;

    var updateInfo = {"comment" : body.claimComments,
                      "updateSource" : body.messageSource};


    console.log("for instanceId[" + instanceId + "], updateInfo: ", updateInfo);

    signalHumanTask(instanceId, "Update%20Information", function(error){

        if (!error){

            listReadyTasks (instanceId, "Update Information", function(error, taskId){

                if (!error){

                    console.log("calling updateInformation");
                    updateInformation (taskId, updateInfo, function(error){

                        if (!error){
                            console.log("Claim updated successful");
                            res.json("SUCCESS");

                        }
                        else{
                            var msg = "Unable to add comment, error: " + error;
                            console.error(msg);
                            res.json(msg);
                        }
                    });

                }
                else{
                    var msg = "Unable to list ready tasks, error: " + error;
                    console.error(msg);
                    res.json();
                }

            });
        }
        else{
            var msg = "Unable to signal for human task, error: " + error;
            console.error(msg);
            res.json("Unable to signal for human task, error: " + error);
        }

    });

    // mbaasApi.service({
    //     guid : serviceId,
    //     path : '/api/v1/bpms/add-comments/' + req.params.processInstanceId,
    //     method : 'POST',
    //     params : req.body
    // }, function(error, body, response) {
    //     if(error) {
    //         res.json(error);
    //     }
    //     if(body) {
    //         res.json(body);
    //     }
    //     res.json({message: 'Unexpected path'});
    // });
};

//Perform Remediation
exports.performRemediation = function (req, res){

    console.log("Inside performRemediation");

    var body = req.body;

    //console.log("body: ", body);

    var instanceId = req.params.instanceId;
    var complete = req.params.complete;

    var updateInfo = {"completed" : complete};


    console.log("complete[" + complete + "] for instanceId[" + instanceId + "], updateInfo: ", updateInfo);

    signalHumanTask(instanceId, "Perform%20Remediation", function(error){

        if (!error){

            listReadyTasks (instanceId, "Perform Remediation", function(error, taskId){

                if (!error){

                    console.log("calling updateInformation");
                    updateInformation (taskId, updateInfo, function(error){

                        if (!error){
                            console.log("Claim updated successful");
                            res.json("SUCCESS");

                        }
                        else{
                            var msg = "Unable to add comment, error: " + error;
                            console.error(msg);
                            res.json(msg);
                        }
                    });

                }
                else{
                    var msg = "Unable to list ready tasks, error: " + error;
                    console.error(msg);
                    res.json(msg);
                }

            });
        }
        else{
            var msg = "Unable to signal for human task, error: " + error;
            console.error(msg);
            res.json(msg);
        }

    });
};

function signalHumanTask (instanceId, type, cb){

    console.log("Inside signalHumanTask, instanceId: " + instanceId + " type["+type+"]");

    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/containers/' + CONTAINER_ID + '/processes/instances/signal/' + type + '?instanceId=' + instanceId,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': BASIC_AUTH
        },
        method: 'POST'
    };

    //send request
    request(options, function (error, response, body) {
        //console.log("BODY: ", body);
        console.log("response.statusCode: ", response.statusCode);
        if (!error && response.statusCode == 200) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("DATA: ", data);
            //return res.json(body);
            cb(null);
        }
        else {
            console.log('Error happened: '+ error);
            //res.json(error);
            cb(error);
        }
    });


}

//List Ready Tasks
function listReadyTasks (instanceId, type, cb){

    console.log("Inside listReadyTasks for type["+type+"], instanceId: ", instanceId);

    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/queries/tasks/instances/process/' + instanceId + '?status=Ready',
        headers: {
            'Accept': 'application/json',
            'Authorization': BASIC_AUTH
        },
        method: 'GET'
    };

    //send request
    request(options, function (error, response, body) {
      //console.log("BODY: ", body, typeof body);
        //console.log("response: ", response);

        if (!error && response.statusCode == 200) {

            var data = JSON.parse(body);
            var tasks = data["task-summary"];

            console.log("found tasks");

            if (tasks != undefined){

                // go through the list of tasks and find the 'Update Information task
                for(var i = 0; i < tasks.length; i++){

                    //task[i]["task-id"] === instanceId &&

                    if (tasks[i]["task-name"] === type && tasks[i]["task-status"] === "Ready"){
                        console.log("found task: " + tasks[i]["task-id"] + " for type["+type+"]");
                        return cb(null, tasks[i]["task-id"]);

                    }
                }

                // if no task was found just exit
                return cb(new Error("unable to find task"));

            }
            else{
                cb(null);
            }

        }
        else {
            console.error("got an error: ", error);

            cb(error);

        }
    });

}

function updateInformation (taskId, updateInfo, cb){

    console.log("Inside updateInformation, taskId["+taskId+"], updateInfo: ", updateInfo);

    // sample updateInfo:
    // {
    //     "comment" : "hello from postman2",
    //     "photoId" : "incident.png",
    //     "updateSource" : "responder"
    // }

    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/containers/' + CONTAINER_ID + '/tasks/' + taskId + '/states/completed?auto-progress=true',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': BASIC_AUTH
        },
        method: 'PUT',
        json: updateInfo
    };

    //send request
    request(options, function (error, response, body) {
        //console.log("BODY: ", body, typeof body);
        console.log("response.statusCode: ", response.statusCode);
        if (!error && response.statusCode == 201) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("DATA: ", data);
            //return res.json(body);
            cb(null);
        }
        else {
            console.log('Error happened: '+ error);
            //res.json(error);
            cb(error);
        }
    });
};
