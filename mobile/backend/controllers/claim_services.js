var request = require('request');
var http = require('http')
  , https = require('https')
  //,rest = require('restler')
  , fs = require('fs');

var process_server = require('./process_server');


var SERVICES_SERVER_HOST = process.env.SERVICES_SERVER_HOST || 'localhost:8080';


exports.addPhoto = function (req, res){
    var fileName = req.file.originalname;

    console.log("Inside addPhoto");
    console.log("originalname: " + fileName);

    var instanceId = req.params.instanceId;
    var updateSource = req.params.messageSource;

    console.log("instanceId : " + instanceId + ", updateSource: " + updateSource);

    console.log("fileName passes by client: " + req.params.fileName);

    var options = {
        url: 'http://' + SERVICES_SERVER_HOST + '/photos/' + instanceId,
        headers: {
            'Accept': 'application/json'
            //,'Content-Type': 'multipart/form-data'
        },
        method: 'POST'
    };

    //var filePost = request.post('http://' + SERVICES_SERVER_HOST + '/photos/' + instanceId,
    var filePost = request(options, function (error, response, body) {

        //console.log("BODY: ", body, typeof body);
        console.log("response.statusCode: ", response.statusCode);

        if (!error && response.statusCode == 200) {

            // sample response
            // {
            //     "message": "successful file upload",
            //     "details": "1-iden_new.png",
            //     "result": true
            // }

            var data = JSON.parse(body);
            console.log("DATA: ", data);

            process_server.addPhoto(instanceId, fileName, updateSource, function(){
                console.log("Done adding photo: " + fileName);
                return res.json({link: "http://" + SERVICES_SERVER_HOST + "/photos/" + instanceId + "/" + fileName});
            });

        }
        else if (error){
            console.error('Error happened: '+ error);

            res.json(error);
        }
        else{
            res.json(body);
        }
    });

    var form = filePost.form();
    form.append('file', fs.createReadStream(req.file.path), {
        filename: fileName,
        contentType: req.file.mimetype
    });
};

exports.createClaim = function (req, res) {

    console.log("Inside createClaim, not implemented yet");
};
