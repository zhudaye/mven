var MongoClient = require('mongodb').MongoClient;
var mongodb = {
	connect: function(dburl,callback){
        MongoClient.connect(dburl, (err,db) => {
            if(err){
            	callback(-1);
            }
            callback(db);
        })
	},

	closeDb: function(db){
		db.close();
	},

	find: function(db,tablename,query,callback){
		let collection = db.collection(tablename);
		collection.find(query).toArray((err,result) => {
			if(err){
				callback(-2);
				db.close();
			}
            callback(result);
		})
	},

	insert: function(db,tablename,option,callback){
		let collection = db.collection(tablename);
	    collection.insert(option, (err,result) => {
			if(err){
				callback(-2);
			}
			callback(result);
		})
	},

	update: function(db,tablename,query,newvalue,callback){
		let collection = db.collection(tablename);
		collection.update(query, newvalue, (err,result) => {
			if(err){
				callback(-2);
			}
			callback(result);
		})
	},

	remove: function(db,tablename,query,callback){
		let collection = db.collection(tablename);
		collection.remove(query, (err,result) => {
			if(err){
				callback(-2);
			}
			callback(result);
		})
	}
};
module.exports = mongodb;
