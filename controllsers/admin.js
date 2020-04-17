

const collectionA = require('../mongodb/getdata');
// const collectionA = require('../webserver');

// var express = require('express');
// var app = express();

// // // cau hinh EJS
// app.set("view engine", "ejs");
// app.set("views", "./views");



exports.login = function (req, res) {
    collectionA.collectionAdmin.findOne({ emailAdmin: req.body.email }).then((data) => {
        console.log("data");
        console.log(data);
        console.log("email");
        console.log(req.body.email);
        console.log("password");
        console.log(req.body.pass);

        if (data) {
            console.log("data.password " + data.passwordAdmin);
            console.log("req.body.password " + req.body.pass);
            if (data.passwordAdmin == req.body.pass) {
                console.log("login");
                console.log("------------------------");
                //  return res.redirect('/car');
                res.render('car');
                //  return res.sendfile('/car');
            } else {
                console.log("fail");
            }
        }
    })
}




