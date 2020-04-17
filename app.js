// Import module
const express = require('express');
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);



const mongoose = require('mongoose');

const adminRoute = require('./routes/routes.js');
// const serverClient = require ('./server_client');
// serverClient.socketU;

const mongodb = require('./mongodb/getdata.js');

app.use(adminRoute);

app.use('/css', express.static(__dirname + '/css'));

app.use(express.static('public'));
app.use(express.static('uploads'));

// app.use('/uploads', express.static(__dirname + '/uploads'));
// app.use('/public', express.static(__dirname + '/public'));

//Set port
http.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        console.log("err" + err);
    } else {
        console.log("App server running PORT 3000");
    }
});

// connect mongoose
mongoose.connect('mongodb://localhost:27017/car', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.log('Mongoose can not connect to mongodb, because ' + err);
    } else {
        console.log('Mongoose connect to mongodb successful');
    }

});


// cau hinh EJS
app.set("view engine", "ejs");
app.set("views", "./views");




//-------------------------------------------------------- client





////ket noi socket
io.sockets.on('connection', function (socket) {

    console.log("There is a connected device Login");

    // lang nghe  su kien login
    socket.on('loginUser', function (email, password) {

        console.log("Event Login User: " + email + " & pass: " + password);

        const cursor = mongodb.collectionUser.find({ email: email });
        cursor.each(function (err, doc) {
            if (err) {
                console.log(err);
                socket.emit('loginUser', false);
            } else {
                if (doc != null) {
                    if (doc.password == password) {
                        console.log(doc.password);
                        socket.emit('loginUser', true);
                    } else {
                        socket.emit('loginUser', false);
                    }
                } else {
                    socket.emit('loginUser', false);

                }

            }
        });

        // socket.on('loginUser', function (email, password) {

        //     console.log("Event Login User: " + email + " & pass: " + password);


        //     collection.find({ email: email }).toArray(function (err, result) {

        //         if (err) {
        //             console.log(err);
        //             socket.emit('loginUser', false);
        //         } else {
        //             if (result != null) {
        //                 if (result[0].password == password) {
        //                     console.log(result[0].password);
        //                     socket.emit('loginUser', true);
        //                 } else {
        //                     socket.emit('loginUser', false);
        //                 }
        //             } else {
        //                 socket.emit('loginUser', false);

        //             }
        //         }
        //     });


    });




    ////Register User
    socket.on('registerUser', function (email, password) {

        console.log("There is a connected device Register");

        console.log("Event registerUser: " + email + " & pass: " + password);

        var user = { email: email, password: password };

        mongodb.collectionUser.insertOne(user, function (err, result) {
            if (err) {
                console.log(err);
                socket.emit('registerUser', false);
            } else {
                if (result) {
                    console.log(result);
                    console.log("Insert successful!");
                    socket.emit('registerUser', true);
                } else {
                    socket.emit('registerUser', false);
                }

            }
        });
    });


    ////Update User
    socket.on('updateUser', function (email, password) {

        console.log("There is a connected device Update");

        console.log("Event updateUser: " + "email " + email + " & pass: " + password);

        mongodb.collectionUser.updateOne(
            { email },
            { $set: { password: password } },
            {
                upsert: false,
                multi: false
            }, function (err, result) {
                if (err) {
                    console.log(err);
                    socket.emit('updateUser', false);
                } else {
                    if (result) {
                        socket.emit('updateUser', true);
                    }
                }
            });
    });

    ////Insert User
    socket.on('insertInforCarUser', function (carName, information) {

        console.log("There is a connected device Register");

        console.log("Event Insert information of User: car name: " + carName + " & information: " + information);

        var user = { carName: carName, information: information };

        mongodb.collectionCarUser.insertOne(user, function (err, result) {
            if (err) {
                console.log(err);
                socket.emit('insertInforCarUser', false);
            } else {
                if (result) {
                    console.log(result);
                    console.log("Insert information car user successful!");
                    socket.emit('insertInforCarUser', true);
                } else {
                    socket.emit('insertInforCarUser', false);
                }

            }
        });
    });


    // Get All Car User Information of Client

    socket.on('getAllInfor', function (msg) {
        console.log("----------------------------------------Get Car Infor ");
        console.log("Get Car Infor: " + msg);

        var cursor = mongodb.collectionCarUser.find();

        cursor.each(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                if (doc != null) {
                    var strings = JSON.parse(JSON.stringify(doc));
                    console.log(strings);
                    socket.emit('getAllInfor', strings);
                } else if (doc == null) {
                    console.log("finish getAllInfor");
                    console.log("----------------------------------------finish getAllInfor");
                }
            }
        })
    });


        // Get All Car Product
        socket.on('getAllCarProduct', function (msg) {
            console.log("----------------------------------------Get Car Product ");
            console.log("Get Car Infor: " + msg);
    
            var cursor = mongodb.collectionCarProduct.find();
    
            cursor.each(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    if (doc != null) {
                        var strings = JSON.parse(JSON.stringify(doc));
                        console.log(strings);
                        socket.emit('getAllCarProduct', strings);
                    } else if (doc == null) {
                        console.log("finish getAllCarProduct");
                        console.log("----------------------------------------finish getAllCarProduct");
                    }
                }
            })
        });


});

module.exports = io.sockets;


//// Lấy IP theo máy tính
var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 adress
            console.log(ifname, iface.address);
        }
        ++alias;
    });
});






//----------------------------------------
// var http = require('http');

// //router
// var router = require('router');

// //Create Sever
// var router = express();
// var server = http.createServer(router);

// // load image
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // cho phép người dùng tải xuống những file css
// router.use('/css', express.static(__dirname + '/css'));
// router.use('/uploads', express.static(__dirname + '/uploads'));
// router.use('/public', express.static(__dirname + '/public'));
// router.use('/public/uploads', express.static(__dirname + '/public/uploads'));
// router.use(express.static(path.join(__dirname, 'public')));



// // //body - parser lấy dữ liệu từ form
// // var bodyParser = require('body-parser');
// // // parse application/x-www-form-urlencoded
// // router.use(bodyParser.urlencoded({ extended: false }));
// // // parse application/json
// // router.use(bodyParser.json())

// // Import 
// const loginAdmin = require('./controllsers/admin');

// const server_client = require('./server_loginU');
// server_client.socketU;
// const showU = require('./admin/showUser');
// const user = require('./Model/user');
// // const mongodb = require('./mongodb/getdata');



// //Set port
// server.listen(process.env.PORT || 8080, function (err) {
//     if (err) {
//         console.log("err" + err);
//     } else {
//         console.log("server running");
//     }
// });

// //Routes HTTP GET Request /localhost:8080/
// router.get('/', function (req, res) {
//     res.render('index');
// });

// router.get('/login', function (req, res) {
//     res.render('login');
// });

// router.get('/car', function (req, res) {
//     // res.sendFile(__dirname + '/car.html');
//     res.render('car');
// });

// router.post('/car', loginAdmin.login);

// router.get('/user', showU.getAllUser);

// router.post('/user', showU.getAllUser);

// router.post('/user', function (req, res) {
//     res.render('user');
// });

// //--------------------------------------------- insert

// // var storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //         cb(null, './public/uploads')
// //     },

// //     filename: (req, file, cb) => {
// //         cb(null, file.originalname);
// //     },

// // })

// // const upload = multer({
// //     storage: storage,
// //     //kiểm tra file upload có phải là hình ảnh hay không
// //     fileFilter: function (req, file, callback) {
// //         var ext = path.extname(file.originalname);
// //         if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
// //             return callback(new Error('Only images are allowed'));
// //         }
// //         callback(null, true);
// //     },
// //     limits: {
// //         fileSize: 1024 * 1024 * 5,//giới hạn filesize = 5Mb
// //     },
// // });



// // router.post("/upload", upload.single('myImage'), (req, res) => {
// //     console.log('-----------------------------name');
// //     console.log(req.body.name);
// //     console.log('-----------------------------name');

// //     let insertUser = new user({
// //         name: req.body.name,
// //         email: req.body.email,
// //         password: req.body.password,
// //         information: req.body.information,
// //         images: req.file.originalname
// //         // images: req.file.originalname
// //     });

// //     insertUser.save(function (err) {
// //         if (err) {
// //             console.log(err);
// //             return;
// //         } else {
// //             res.redirect('user');
// //         }
// //     })

// //     // mongodb.collectionUser.insertOne(user1, (err, result) => {
// //     //     // console.log(result);

// //     //     if (err) {
// //     //         return console.log(err);
// //     //     } else {
// //     //         console.log("Saved to database");
// //     //         // res.contentType(finalImg.contentType);
// //     //         // res.send(file.originalname);
// //     //         res.redirect('user');
// //     //     }

// //     // })
// // })

// //---------------------------------------------

// // router.get('/edit/:_id', showU.getIdUser);
// router.get('/edit/:_id', function (req, res) {

//     user.findById(req.params._id)
//         .lean()
//         .exec((err, doc) => {
//             if (!err) {
//                 res.render('user', { user: doc });
//             }
//         });
// });

// router.post('/edit', function (req, res) {

//     user.updateOne(
//         { _id: req.body._id },
//         {
//             $set: {
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 information: req.body.information,
//                 // images: req.file.originalname
//             }
//         }, (err, doc) => {
//             if (!err) {
//                 console.log("----------------------------------Edit to database");
//                 console.log(doc);
//                 res.redirect('user');
//             } else {
//                 console.log('----------------------------------Edit Failed');
//             }
//         }
//     )
// });




//----------------------------------------------------------------------------------

// app.get('/car', function (req, res) {
//     res.render('car');
// });

// app.get('/car', function (req, res) {
//     // res.sendFile('car.html', { root: __dirname });
// });



// app.get('/user', showUser.showUser);

//Routes HTTP POST  Request
// app.post('/car', function (req, res) {

//     if (req.method === 'POST') {
//         var data = '';

//         // sự kiện  req.on('data') và  req.on('end') end là khi sự kiện kết thúc

//         // chunk là  data rời. Mỗi lần có dữ liệu gửi lên nó sẽ cộng vô biến data nó sẽ tạo ra chuỗi email=abc%40fpt.edu.vn&pass=fsaf 

//         req.on('data', function (chunk) {
//             data += chunk;
//             console.log("chunk = " + chunk);
//             console.log("data = " + data);

//         })

//         req.on('end', function () {
//             var values = data.split("&");
//             var email = values[0].split("=");
//             var emailAdmin = email[1];
//             var pass = values[1].split("=");
//             var passwordAdmin = pass[1];



//             console.log("data = " + data);
//             console.log("Email = " + emailAdmin);
//             console.log("Pass = " + passwordAdmin);

//         });

//     }

//     res.sendfile('car.html');
// });





