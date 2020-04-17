 const mongoose = require('mongoose');

 const Schema = mongoose.Schema;
 
 const user = new Schema({
     name: {type: String},
     email: {type: String},
     password: {type: String},
     information: {type: String},
     images: {type: String}
 })

 module.exports = mongoose.model('user', user);