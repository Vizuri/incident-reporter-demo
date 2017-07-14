var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var request = require('request');
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/'});	// ,inMemory: true
var fs = require('fs');

var app = express();

// list the endpoints which you want to make securable here
var securableEndpoints = [];

console.log("Starting backend mobile app: ", process.argv[1]);

// Enable CORS for all requests
app.use(cors());
var jsonParser = bodyParser.json();

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Bootstrap routes
require('./config/routes')(app, jsonParser, upload);

app.get('/test', jsonParser, function(req, res) {
	res.json({message: 'test endpoint under construction'});
});

app.get('/api/v1/bpms/', jsonParser, function(req, res) {
	res.json({message: 'bpms endpoint under construction'});
});

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 7001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
	console.log("App started at: " + new Date() + " on port: " + port);
});
