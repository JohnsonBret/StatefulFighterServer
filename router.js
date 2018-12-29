var path    = require("path");
var bodyParser = require("body-parser");
var mysql = require('mysql');

module.exports = function(app){

    // MySql Database Connection
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'HB123456',
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

        //Temp Remove this when we get our sessions handled
        var user_id = 2;
    
        console.log(`results was requested with query 
        Winner: ${winner} 
        hero health Left ${heroHealth} 
        and villain health left ${villianHealth}`);
    
        var sql = 'INSERT INTO stats (user_id, winner, hero_health_left, villian_health_left) VALUES (?)';
            console.log("Sql query is:", sql);
            connection.query(sql, [[`${user_id}`,`${winner}`, `${heroHealth}`, `${villianHealth}`]], function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
        });
    
        //Dry it up
        connection.query("SELECT winner, COUNT(winner) as total FROM stats GROUP BY winner", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    
    });
    
    app.get('/stats', function(req, res){
    
        //Dry it up
        connection.query("SELECT winner, COUNT(winner) as total FROM stats GROUP BY winner", function (err, result, fields) {
            if (err) throw err;
            // console.log(result);
            res.send(result);
        });
    });

    app.get('/chartData', function(req, res){
    
        //Dry it up
        connection.query("SELECT id, winner, created_at FROM stats ORDER BY created_at", function (err, result, fields) {
            if (err) throw err;
            // console.log(result);
            res.send(result);
        });
    });
    
    app.get('/fight_script.js', function(req, res){
        res.sendFile(path.join(__dirname+'/fight_script.js'));
    });
    
    app.get('/chart.js', function(req, res){
        res.sendFile(path.join(__dirname+'/chart.js'));
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
              res.redirect('/fight');
            });
    });
};