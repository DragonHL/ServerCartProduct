const carUser = require('../Model/caruser');

const car = require('../Model/car');



//get tất cả sản phẩm
exports.getAllCarUser = function (request, response) {

   
    carUser.find()
    .lean()
        .exec(function (err, data) {
            
            response.render('carUser', { listcaruser: data.reverse()});
            console.log(data);
            
            if (err) {
                log(error);
            }
        });

};

exports.getIdCarUser = function(request, response){
    carUser.findById(request.params._id)
    .lean()
    .exec((err, doc)=>{
        if(!err){
            response.render('editCarUser', {caruser: doc});
        }
    })
}

exports.deleteCarUser = function(req, res){
    carUser.deleteOne({_id : req.params.id}, (err, doc)=>{
        if(!err){
            res.redirect('/caruser');
        }else{
            console.log(err);
        }
    })
}
