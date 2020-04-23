
const bodyParser = require('body-parser');

const adminController = require('../controllsers/admin');
const inforUserController = require('../controllsers/inforUser.js');
const carController = require('../controllsers/controllersCar.js');
const carUserController = require('../controllsers/cotrollersCarUser.js');
const user = require('../Model/user');
const carProduct = require('../Model/car');
const carusers = require('../Model/caruser');
const admins = require('../Model/admin');


const express = require('express');

const multer = require('multer');
const path = require('path');
const fs = require('fs');


//router
const router = express();

// //body - parser lấy dữ liệu từ form
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());



//------------------------------------------------------------------------

// Sử dụng thư viện PassportJS để kiểm tra đăng nhập.

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//cấu hình passport
router.use(session({
    secret: 'mysecret',//thuôc tính bắt buộc
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 5,
    },
    //cookie sẽ tồn tại trong 5 phút, nếu xóa dòng code sau thì cookie sẽ hết hạn sau khi đóng trinh duyệt
}));

//2 hàm khởi tạo passport
router.use(passport.initialize());
router.use(passport.session());

//chứng thực thông tin đăng nhập trên mongoDB
passport.use(new LocalStrategy({
    //emailAdmin, passwordAdmin là name của thẻ input trong form login, nếu không khai báo mặc định sẽ là username, password
    usernameField: 'emailAdmin',
    passwordField: 'passwordAdmin',
}, (emailAdmin, passwordAdmin, done) => {
    admins.findOne({ emailAdmin: emailAdmin, passwordAdmin: passwordAdmin }, function (err, userP) {
        console.log(userP);
        if (err) {
            console.log(err);
        } else if (userP) {
            //thành công sẽ trả về true với giá trị user
            return done(null, userP);
        } else {
            return done(null, false);
        }
    });
}

));

//sau khi chứng thức thành công passport sẽ gọi hàm .serializeUser() vói tham số user giá trị đã lưu bên trên
//chọn thuộc tính email của user để ghi vào cookie

passport.serializeUser((userP, done)=>{
    done(null, userP.emailAdmin);
})

//biến cookieID chính là giá trị user.email bên trên
passport.deserializeUser((cookieID, done)=>{
    admins.findOne({emailAdmin: cookieID}, function(err, userP){
        if(err){
            console.log(err);
        }else if(userP){
            return done(null, userP);
        }else{
            return done(null, false);
        }
    });
});

//khai báo phương thức xác thực đăng nhập sau
const isAuthenticated = function(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    response.redirect('/login'); //nếu chưa đăng nhập sẽ quay về trang login
}


//---------------------------------------------------------------------------


router.get('/', function (req, res) {
    res.render('index');
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {successRedirect: '/car', failureRedirect: '/login'}));

// router.post('/login', adminController.login);



router.get('/car', isAuthenticated,carController.getAllCar);
router.post('/car',isAuthenticated, carController.getAllCar);


router.get('/editCar/:_id', carController.getIdCar);
router.get('/deleteCar/:id', carController.deleteCar);
// router.get('/uploadCar', function (req, res) {
//     // res.sendFile(__dirname + '/car.html');
//     res.render('uploadCar');
// });

router.get('/user',isAuthenticated, inforUserController.getAllUser);

router.get('/edit/:_id', inforUserController.getIdUser);

// router.post('/edit', inforUserController.edit);

router.get('/delete/:id', inforUserController.deleteUser);


router.get('/caruser',isAuthenticated, carUserController.getAllCarUser);
router.get('/editCarUser/:_id', carUserController.getIdCarUser);
router.get('/deleteCarUser/:id', carUserController.deleteCarUser);




// load image

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    //kiểm tra file upload có phải là hình ảnh hay không
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5,//giới hạn filesize = 5Mb
    },
});


router.post("/upload", upload.single('myImage'), (req, res) => {
    let insertUser = new user({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        information: req.body.information,
        images: req.file.originalname
        // images: req.file.originalname
    });

    insertUser.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('user');
        }
    })
})

router.post("/edit", upload.single('myImageEdit'), (req, res) => {

    user.updateOne(
        { _id: req.body._id },
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                information: req.body.information,
                images: req.file.originalname
            }
        }, (err, doc) => {
            if (!err) {
                console.log("----------------------------------Edit to database");
                console.log(doc);
                res.redirect('/user');
            } else {
                console.log('----------------------------------Edit Failed');
            }
        }
    )

})



router.post("/uploadCar", upload.single('myImageCar'), (req, res) => {

    console.log("add car");
    let insertCar = new carProduct({
        nameCar: req.body.nameCar,
        priceCar: req.body.priceCar,
        inforCar: req.body.inforCar,
        imagesCar: req.file.originalname
        // images: req.file.originalname
    });

    insertCar.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/car');
        }
    })
})


router.post("/editCar", upload.single('myImageEditCar'), (req, res) => {

    carProduct.updateOne(
        { _id: req.body._id },
        {
            $set: {
                nameCar: req.body.nameCar,
                priceCar: req.body.priceCar,
                inforCar: req.body.inforCar,
                imagesCar: req.file.originalname
            }
        }, (err, doc) => {
            if (!err) {
                console.log("----------------------------------Edit to database");
                console.log(doc);
                res.redirect('/car');
            } else {
                console.log('----------------------------------Edit Failed');
            }
        }
    )

})


router.post("/uploadCarUser", upload.single('myImage'), (req, res) => {

    console.log("add car user");
    let insertCarUser = new carusers({
        carName: req.body.carName,
        vehicleMaintenance: req.body.vehicleMaintenance,
        images: req.file.originalname

    });

    insertCarUser.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/caruser');
        }
    })
})

router.post("/editCarUser", upload.single('myImageEditCarUser'), (req, res) => {
    console.log("----------------------------------ID Edit to database");
    console.log(req.body._id);
    carusers.updateOne(
        { _id: req.body._id },
        {
            $set: {
                carName: req.body.carName,
                vehicleMaintenance: req.body.vehicleMaintenance,
                images: req.file.originalname
            }
        }, (err, doc) => {
            if (!err) {
                console.log("----------------------------------Edit to database");
                console.log(doc);
                res.redirect('/caruser');
            } else {
                console.log('----------------------------------Edit Failed');
            }
        }
    )

})






module.exports = router;