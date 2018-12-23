var express = require('express');
var path    = require("path");

var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var bodyParser     =        require("body-parser");

const app = express()

//Configure the App to use Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// MySql Database Connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'TPV123456',
    database: 'battle_data'
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected! to Database");

    });


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/createuser.html'));
    //__dirname : It will resolve to your project folder.
});

app.get('/fight', function(req, res){
    res.sendFile(path.join(__dirname+'/fight.html'));
});

app.get('/results', function(req, res){
    var heroHealth = req.query.heroHealth;
    var villianHealth = req.query.villianHealth;
    var winner = req.query.winner;

    console.log(`results was requested with query 
    Winner: ${winner} 
    hero health Left ${heroHealth} 
    and villain health left ${villianHealth}`);

    var sql = 'INSERT INTO stats (winner, hero_health_left, villian_health_left) VALUES (?)';
        console.log("Sql query is:", sql);
        connection.query(sql, [[`${winner}`, `${heroHealth}`, `${villianHealth}`]], function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
    });

    connection.query("SELECT winner, COUNT(winner) as total FROM stats GROUP BY winner", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });

});

app.get('/fight_script.js', function(req, res){
    res.sendFile(path.join(__dirname+'/fight_script.js'));
});

app.get('/fight_style.css', function(req, res){
    res.sendFile(path.join(__dirname+'/fight_style.css'));
});

app.get('/style.css',function(req,res){
    res.sendFile(path.join(__dirname+'/style.css'));
    //__dirname : It will resolve to your project folder.
});


app.post('/postNewUser',function(req,res){
    var user_name= `${req.body.user_name}`;
    console.log(`Got Post User name = ${user_name}`);


        var sql = 'INSERT INTO users (username) VALUES (?)';
        console.log("Sql query is:", sql);
        connection.query(sql, [user_name], function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
   
    res.end("Added user? to Mysql?");
});


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log(`Server listening at ${host} port ${port}`);
})

    


 