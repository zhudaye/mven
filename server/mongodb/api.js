var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('./db');
var api = express();
var DB_CONN = 'mongodb://localhost:27017/vue';
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(cookieParser());
api.get('/login', (req,res) => {
	mongodb.connect(DB_CONN,db => {
		if(db === -1){
			console.log("数据库连接失败!")
			res.send('-1');
			return 
		}
        mongodb.find(db, 'user', {
       	name: req.query.name,
       	password: req.query.password
        },(result) => {
       	    if(result === -2){
       	  	    res.send('-2');
       	    }
       	    else if(result.length > 0){
       	    	res.send('1');
       	    }
       	    else{
       	    	res.send('2');
       	    }
       	    db.close();
       })
	})
})

api.post('/register', (req,res) => {
	mongodb.connect(DB_CONN,db => {
		if(!db){
			console.log("数据库连接失败!")
			res.send('-1');
			return 
		}
		mongodb.find(db, 'user', {
       	name: req.body.name
        },(result) => {
       	    if(result === -2){
       	  	    res.send('-2');
       	  	    db.close();
       	    }

       	    else if(result.length <= 0){
         	    mongodb.insert(db, 'user', {
    		       	name: req.body.name,
    		       	password: req.body.password
    		        },(result) => {
    		       	    if(result === -2){
    		       	  	   res.send('-2');
    		       	    }
    		       	    else if(result.ops.length > 0){
                      res.send('1'); 
    		       	    }
    		       	    else{
                      res.send('2');
    		       	    }
    		       	    db.close();
  		        })
       	    }
       	    else{
       	    	res.send('3');
       	    	db.close();
       	    }
       })
	})
})

module.exports = api;
