var express = require('express');
var path    = require("path");
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var bodyParser = require("body-parser");

const app = express();
//Configure the App to use Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


require('./router.js')(app);


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log(`Server listening at ${host} port ${port}`);
})

    


 