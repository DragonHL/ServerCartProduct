const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carusers = new Schema({
    carName: {type: String},
  
    vehicleMaintenance: {type: String},
    images: {type: String}
  
})

module.exports = mongoose.model('carusers', carusers);
