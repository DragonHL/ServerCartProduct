const user = require('../Model/user');


// get all data user
//get tất cả sản phẩm
exports.getAllUser = function (request, response) {

    user.find()
    .lean()
        .exec(function (err, data) {
            // console.log(data);
            response.render('user', { list: data.reverse()});
            
            if (err) {
                log(error);
            }
        });

};


exports.getIdUser = function (request, response) {

    user.findById(request.params._id)
        .lean()
        .exec((err, doc) => {
            if (!err) {
                response.render('edit', { user: doc });
            }
        });

};

exports.deleteUser = function(req, res){
    user.deleteOne({_id: req.params.id}, (err, doc)=>{
        if(!err){
            res.redirect('/user');
        }else{
            console.log(err);
        }
    })
}




//-------------------------------------------------

// exports.edit = function (req, res) {

//     console.log("----------------------------req.param");
//     console.log(req.body._id);
//     console.log("----------------------------");



//     user.updateOne(
//         { _id: req.body._id },
//         {
//             $set: {
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 information: req.body.information,
//                 // images: req.imagesUpdate
//             }
//         },(err, doc) => {
//             if (!err) {
//                 console.log("----------------------------------Edit to database");
//                 console.log(doc);
//                 res.redirect('/user');
//             } else {
//                 console.log('----------------------------------Edit Failed');
//             }
//         }
//     )
// }

