var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('./db');
var api = express();
var DB_CONN = 'mongodb://localhost:27017/vue';
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
api.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '200mb',
    extended: true
  }));
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

api.post('/saveimg', (req,res) => {
  mongodb.connect(DB_CONN,db => {
    if(!db){
      console.log("数据库连接失败!")
      res.send('-1');
      return 
    }
    mongodb.find(db, 'img', {
        imgname: req.body.imgname
        },(result) => {
            if(result === -2){
                res.send('-2');
                db.close();
            }

            else if(result.length <= 0){
              mongodb.insert(db, 'img', {
                imgname: req.body.imgname,
                username: req.body.username,
                type: req.body.type,
                img: req.body.img
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

api.post('/removeimg', (req,res) => {
  mongodb.connect(DB_CONN,db => {
    if(!db){
      console.log("数据库连接失败!")
      res.send('-1');
      return 
    }
    mongodb.remove(db, 'img', {
      imgname: req.body.imgname,
      username: req.body.username
    },(result) => {
      if(result === -2){
          res.send('-2');
          return;
      }
      if(result.result.n > 0){
          res.send('1');
      }
    })
  })
})

api.get('/getimg', (req,res) => {
  mongodb.connect(DB_CONN,db => {
    if(db === -1){
      console.log("数据库连接失败!")
      res.send('-1');
      return 
    }
        mongodb.find(db, 'img', {
        username: req.query.username,
        type: req.query.type
        },(result) => {
            if(result === -2){
                res.send('-2');
            }
            else if(result.length > 0){
              res.send(result);
            }
            else{
              res.send('2');
            }
            db.close();
       })
  })
})

module.exports = api;
