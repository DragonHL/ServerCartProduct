

// const collectionA = require('../mongodb/getdata');

// exports.login = function (req, res) {
//     collectionA.collectionAdmin.findOne({ emailAdmin: req.body.email }).then((data) => {
//         console.log("data");
//         console.log(data);
//         console.log("email");
//         console.log(req.body.email);
//         console.log("password");
//         console.log(req.body.pass);

//         if (data) {
//             console.log("data.password " + data.passwordAdmin);
//             console.log("req.body.password " + req.body.pass);
//             if (data.passwordAdmin == req.body.pass) {
//                 console.log("login");
//                 console.log("------------------------");
//                  return res.redirect('/car');

//             } else {
//                 console.log("fail");
//             }
//         }
//     })
// }

// console.log("------------------------------------------------------findAdmin11111");

// const Admin = require('../Model/admin');

// exports.login = function (req, res) {
//     Admin.findOne({ emailAdmin: req.body.emailAdmin }).then((data) => {

//         if (data) {
//             if ((data.passwordAdmin == req.body.passwordAdmin)) {
//                 console.log("------------------------------------------------------findAdmin");
//                 console.log(data);
//                 res.redirect('car');
//             }
//         }
//     });
// };


