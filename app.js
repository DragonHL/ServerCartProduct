// Import module
const express = require('express');
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);
var fs = require('fs');
const mongoose = require('mongoose');

const adminRoute = require('./routes/routes.js');


// const mongodb = require('./mongodb/getdata.js');



app.use(adminRoute);

app.use('/css', express.static(__dirname + '/css'));

app.use(express.static('public'));
app.use(express.static('uploads'));

// app.use('/uploads', express.static(__dirname + '/uploads'));

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
    //    exports.collectionAdmin = db.collection('Admins');
    } else {
        console.log('Mongoose connect to mongodb successful');
    }

});


// cau hinh EJS
app.set("view engine", "ejs");
app.set("views", "./views");


//----------------------------------------------------------mongodb

// mongodb
var mongodb = require('mongodb');


var MongoClient = mongodb.MongoClient;
const assert = require('assert');


// Connection URL
const url = 'mongodb://localhost:27017/';

// Database Name
const dbName = 'car';

// Use connect method to connect to the server
MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);
    console.log("Mongodb connected successfully to server");

    const db = client.db(dbName);
    // exports.collectionAdmin = db.collection('admin');
    // exports.collectionCarU = db.collection('caruser');

    collectionUser = db.collection('users');

    collectionCarUser = db.collection('carusers');
    collectionCarProduct = db.collection('carproducts');



    // client.close();
});




//-------------------------------------------------------- client

////ket noi socket
io.sockets.on('connection', function (socket) {

    console.log("There is a connected device Login");

    // lang nghe  su kien login
    socket.on('loginUser', function (email, password) {

        console.log("Event Login User: " + email + " & pass: " + password);

        const cursor = collectionUser.find({ email: email });
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

    });

    ////Register User
    socket.on('registerUser', function (email, password) {

        console.log("There is a connected device Register");

        console.log("Event registerUser: " + email + " & pass: " + password);

        var user = { email: email, password: password };

        collectionUser.insertOne(user, function (err, result) {
            if (err) {
                console.log(err);
                socket.emit('registerUser', false);
            } else {
                if (result) {
                    // console.log(result);
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

        collectionUser.updateOne(
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


    //--------------------------------------------------Car User
    ////Insert Car User
    socket.on('insertInforCarUser', function (carName, vehicleMaintenance, images) {

        console.log("There is a connected device " + socket.id);

         console.log("Event Insert information of User: car name: " + carName + " & vehicleMaintenance: " + vehicleMaintenance + " & images: " + images);

        var nameImages = "./public/uploads/" + socket.id.substring(2) + getMilis() + ".png";
        const images1= socket.id.substring(2) + getMilis() + ".png";


        console.log("-------------------------------nameImages: " + nameImages);

        fs.writeFile(nameImages, images, function (err, result) {
            if (err) {
                console.log('error', err);
            } else {
                console.log('data', images);
            };
        });

        var user = { carName: carName, vehicleMaintenance: vehicleMaintenance, images: images1 };
        console.log("-------------------------------------------------------user")
        console.log(user);
        collectionCarUser.insertOne(user, function (err, result) {
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

        var cursor = collectionCarUser.find();

        cursor.each(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                if (doc != null) {
                    var strings = JSON.parse(JSON.stringify(doc));
                    // console.log(strings);
                    socket.emit('getAllInfor', strings);
                } else if (doc == null) {
                    console.log("finish getAllInfor");
                    console.log("----------------------------------------finish getAllInfor");
                }
            }
        })
    });


    socket.on('updateCarUser', function (_id, images, carName, vehicleMaintenance) {
        console.log('IDcarUserUpdate: ' + _id + ' carNameUpdate: ' + carName + ' infocarUserUpdate: ' + vehicleMaintenance + 'imagesUpdate: ' + images);
      
        var nameImages = "./public/uploads/" + socket.id.substring(2) + getMilis() + ".png";
        const images1= socket.id.substring(2) + getMilis() + ".png";


        console.log("-------------------------------nameImages: " + nameImages);

        fs.writeFile(nameImages, images, function (err, result) {
            if (err) {
                console.log('error', err);
            } else {
                console.log('data', images);
            };
        });
      
      
      
        collectionCarUser.update({
            _id: new mongodb.ObjectID(_id)
        },
            {
                $set: {
                    carName: carName,
                    vehicleMaintenance: vehicleMaintenance,
                    images: images1
                }
            }, function (err, result) {
                if (err) {
                    console.log(err);
                    socket.emit('updateCarUser', false);
                } else {
                    socket.emit('updateCarUser', true);
                }
            });
    });


    socket.on('deleteCarUser', function (_id) {
        console.log('id delete Car User ' + _id);

        collectionCarUser.remove(
            { _id: new mongodb.ObjectID(_id) },
            {
                justOne: true
            },
            function (err, result) {
                if (err) {
                    console.log(err);
                    socket.emit('deleteCarUser', false);
                } else {
                    console.log("Delete Car User successfully!");
                    socket.emit('deleteCarUser', true);
                }
            }
        )
    });

    //--------------------------------------------------Car Product
    // Get All Car Product
    socket.on('getAllCarProduct', function (msg) {
        console.log("----------------------------------------Get Car Product ");
        // console.log("Get Car Infor: " + msg);

        var cursor = collectionCarProduct.find();

        cursor.each(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                if (doc != null) {
                    var strings = JSON.parse(JSON.stringify(doc));
                    // console.log(strings);
                    socket.emit('getAllCarProduct', strings);
                } else if (doc == null) {
                    console.log("finish getAllCarProduct");
                    console.log("----------------------------------------finish getAllCarProduct");
                }
            }
        })
    });


});

//------------------------------------------- Client



function getMilis() {
    var date = new Date();
    var milis = date.getTime();
    return milis;
    // console.log(milis);
}

function getFilenameImage(id) {
    // id.substring(2)là muốn cắt bỏ 2 ký tự đâu bắt đầu lấy từ ký tự thứ 2 của socket.id .

    var nameImages = "images/" + id.substring(2) + getMilis() + ".png";
    return nameImages;

}




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





