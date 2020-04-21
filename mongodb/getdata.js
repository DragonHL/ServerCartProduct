// mongodb
var mongodb = require('mongodb');


var MongoClient = mongodb.MongoClient;
const assert = require('assert');


// Connection URL
const url = 'mongodb://localhost:27017/';

// Database Name
const dbName = 'car';

// Use connect method to connect to the server
MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser:true }, function (err, client) {
    assert.equal(null, err);
    console.log("Mongodb connected successfully to server");

    const db = client.db(dbName);
    // exports.collectionAdmin = db.collection('admin');
    // exports.collectionUser = db.collection('users');

    exports.collectionUser = db.collection('users');

    exports.collectionCarUser = db.collection('caruser');
    exports.collectionCarProduct = db.collection('carproducts');


   
    // client.close();
});

