// var express = require("express");
// var app = express();
// var server = require("http").createServer(app);
// var io = require("socket.io").listen(server);
// // var fs = require("fs");
// // var mongodb = require('mongodb');

// // Tạo cổng POrt 3000
// // server.listen(process.env.PORT || 3000, function (err) {
// //     if (err) {
// //         console.log("err" + err);
// //     } else {
// //         console.log("server running");
// //     }
// // });


// // var MongoClient = mongodb.MongoClient;
// // const assert = require('assert');


// // // Connection URL
// // const url = 'mongodb://localhost:27017/';

// // // Database Name
// // const dbName = 'car';

// // // Use connect method to connect to the server
// // MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
// //     assert.equal(null, err);
// //     console.log("Connected successfully to server client");

// //     const db = client.db(dbName);
// //     collectionUser = db.collection('users');

// //     collectionCarUser = db.collection('caruser');
// //     collectionCarProduct = db.collection('carproducts');
// //     // client.close();
// // });


// const mongodb = require('./mongodb/getdata.js');


// ////ket noi socket
// io.sockets.on('connection', function (socket) {

//     console.log("There is a connected device Login");

//     // lang nghe  su kien login
//     socket.on('loginUser', function (email, password) {

//         console.log("Event Login User: " + email + " & pass: " + password);

//         const cursor = mongodb.collectionUser.find({ email: email });
//         cursor.each(function (err, doc) {
//             if (err) {
//                 console.log(err);
//                 socket.emit('loginUser', false);
//             } else {
//                 if (doc != null) {
//                     if (doc.password == password) {
//                         console.log(doc.password);
//                         socket.emit('loginUser', true);
//                     } else {
//                         socket.emit('loginUser', false);
//                     }
//                 } else {
//                     socket.emit('loginUser', false);

//                 }

//             }
//         });

//         // socket.on('loginUser', function (email, password) {

//         //     console.log("Event Login User: " + email + " & pass: " + password);


//         //     collection.find({ email: email }).toArray(function (err, result) {

//         //         if (err) {
//         //             console.log(err);
//         //             socket.emit('loginUser', false);
//         //         } else {
//         //             if (result != null) {
//         //                 if (result[0].password == password) {
//         //                     console.log(result[0].password);
//         //                     socket.emit('loginUser', true);
//         //                 } else {
//         //                     socket.emit('loginUser', false);
//         //                 }
//         //             } else {
//         //                 socket.emit('loginUser', false);

//         //             }
//         //         }
//         //     });


//     });




//     ////Register User
//     socket.on('registerUser', function (email, password) {

//         console.log("There is a connected device Register");

//         console.log("Event registerUser: " + email + " & pass: " + password);

//         var user = { email: email, password: password };

//         mongodb.collectionUser.insertOne(user, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 socket.emit('registerUser', false);
//             } else {
//                 if (result) {
//                     console.log(result);
//                     console.log("Insert successful!");
//                     socket.emit('registerUser', true);
//                 } else {
//                     socket.emit('registerUser', false);
//                 }

//             }
//         });
//     });


//     ////Update User
//     socket.on('updateUser', function (email, password) {

//         console.log("There is a connected device Update");

//         console.log("Event updateUser: " + "email " + email + " & pass: " + password);

//         mongodb.collectionUser.updateOne(
//             { email },
//             { $set: { password: password } },
//             {
//                 upsert: false,
//                 multi: false
//             }, function (err, result) {
//                 if (err) {
//                     console.log(err);
//                     socket.emit('updateUser', false);
//                 } else {
//                     if (result) {
//                         socket.emit('updateUser', true);
//                     }
//                 }
//             });
//     });

//     ////Insert User
//     socket.on('insertInforCarUser', function (carName, information) {

//         console.log("There is a connected device Register");

//         console.log("Event Insert information of User: car name: " + carName + " & information: " + information);

//         var user = { carName: carName, information: information };

//         mongodb.collectionCarUser.insertOne(user, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 socket.emit('insertInforCarUser', false);
//             } else {
//                 if (result) {
//                     console.log(result);
//                     console.log("Insert information car user successful!");
//                     socket.emit('insertInforCarUser', true);
//                 } else {
//                     socket.emit('insertInforCarUser', false);
//                 }

//             }
//         });
//     });


//     // Get All Car User Information of Client

//     socket.on('getAllInfor', function (msg) {
//         console.log("----------------------------------------Get Car Infor ");
//         console.log("Get Car Infor: " + msg);

//         var cursor = mongodb.collectionCarUser.find();

//         cursor.each(function (err, doc) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 if (doc != null) {
//                     var strings = JSON.parse(JSON.stringify(doc));
//                     console.log(strings);
//                     socket.emit('getAllInfor', strings);
//                 } else if (doc == null) {
//                     console.log("finish getAllInfor");
//                     console.log("----------------------------------------finish getAllInfor");
//                 }
//             }
//         })
//     });


//         // Get All Car Product
//         socket.on('getAllCarProduct', function (msg) {
//             console.log("----------------------------------------Get Car Product ");
//             console.log("Get Car Infor: " + msg);
    
//             var cursor = mongodb.collectionCarProduct.find();
    
//             cursor.each(function (err, doc) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     if (doc != null) {
//                         var strings = JSON.parse(JSON.stringify(doc));
//                         console.log(strings);
//                         socket.emit('getAllCarProduct', strings);
//                     } else if (doc == null) {
//                         console.log("finish getAllCarProduct");
//                         console.log("----------------------------------------finish getAllCarProduct");
//                     }
//                 }
//             })
//         });


// });

// module.exports = io.sockets;


// //// Lấy IP theo máy tính
// var os = require('os');
// var ifaces = os.networkInterfaces();

// Object.keys(ifaces).forEach(function (ifname) {
//     var alias = 0;

//     ifaces[ifname].forEach(function (iface) {
//         if ('IPv4' !== iface.family || iface.internal !== false) {
//             // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
//             return;
//         }

//         if (alias >= 1) {
//             // this single interface has multiple ipv4 addresses
//             console.log(ifname + ':' + alias, iface.address);
//         } else {
//             // this interface has only one ipv4 adress
//             console.log(ifname, iface.address);
//         }
//         ++alias;
//     });
// });

