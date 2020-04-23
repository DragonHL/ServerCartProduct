const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const admins = new Schema({
   
    emailAdmin: {type: String},
    passwordAdmin: {type: String},
   
})
console.log("------------------------------------------------------dataadmin");
module.exports = mongoose.model('admins', admins);