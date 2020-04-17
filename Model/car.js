const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carProduct = new Schema({
    imagesCar: {type: String},
    nameCar: {type: String},
    priceCar: {type: String},
    inforCar: {type: String}
})

module.exports = mongoose.model('carProduct', carProduct);