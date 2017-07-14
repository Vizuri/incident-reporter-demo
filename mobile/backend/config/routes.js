
var claim_services = require('../controllers/claim_services');
var process_server = require('../controllers/process_server');
var decision_server = require('../controllers/decision_server');



//This file is for your rest endpoints and will be used to link the url
module.exports = function (app, jsonParser, upload) {


    console.log("Loading routes");

    // PROCESS SERVER ROUTES

    app.post('/api/v1/bpms/startprocess', jsonParser, process_server.startProcess);

    app.post('/api/v1/bpms/add-comments/:instanceId', jsonParser, process_server.addComment);


    app.post('/api/v1/bpms/doadjuster/:instanceId/:complete', jsonParser, process_server.performRemediation);

    // app.post('/api/v1/bpms/doadjuster/:processInstanceId', jsonParser, function(req, res) {
    //     console.log("doadjuster not implemented yet");
    //     res.json({message: 'doadjuster endpoint under construction'});
    // });

    app.get('/api/v1/bpms/download-photo/:instanceId/:fileName', jsonParser, function(req, res) {
        console.log("download-photo not implemented yet");
        res.json({message: 'download-photo endpoint under construction'});
    });

    // get list of existing claims
    app.get('/v1/api/claims', jsonParser, process_server.getExistingClaims);


    // load
    app.get('/v1/api/claim', jsonParser, function(req, res) {
        console.log("load claim not implemented yet");
        res.json({message: 'claim endpoint under construction'});
    });

    // create
    app.post('/v1/api/claim', jsonParser, claim_services.createClaim);

    // update
    app.put('/v1/api/claim', jsonParser, function(req, res) {
        console.log("update claim not implemented yet");
        res.json({message: 'claim endpoint under construction'});
    });

    // delete
    app.delete('/v1/api/claim', jsonParser, function(req, res) {
        console.log("delete claim not implemented yet");
        res.json({message: 'claim endpoint under construction'});
    });

    // DECISION SERVER ROUTES

    app.post('/api/v1/bpms/customer-incident', jsonParser, decision_server.createIncident);

    // need the jsonParser to parse the incomming data into a json object
    app.post('/api/v1/bpms/update-questions', jsonParser, decision_server.updateQuestions);

    // CLAIM SERVICES  ROUTES

    app.post('/api/v1/bpms/upload-photo/:instanceId/:fileName/:messageSource', upload.single('file'), claim_services.addPhoto);

};
