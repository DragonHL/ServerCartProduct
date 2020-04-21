const car = require('../Model/car');

//get tất cả sản phẩm
exports.getAllCar = function (request, response) {

    console.log(response.data);
    car.find()
    .lean()
        .exec(function (err, data) {
            console.log(data);
            response.render('car', { list: data.reverse()});
            
            if (err) {
                log(error);
            }
        });

};

exports.getIdCar = function(request, response){
    car.findById(request.params._id)
    .lean()
    .exec((err, doc)=>{
        if(!err){
            response.render('editCar', {car: doc});
        }
    })
}

exports.deleteCar = function(req, res){
    car.deleteOne({_id : req.params.id}, (err, doc)=>{
        if(!err){
            res.redirect('/car');
        }else{
            console.log(err);
        }
    })
}