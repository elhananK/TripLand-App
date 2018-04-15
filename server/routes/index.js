var express = require('express');
var router = express.Router();
var db = require('../db');
var passport = require('../mypassport');
var flash = require('connect-flash');
var multer = require('multer');
var imagesLocation = __dirname + '/../images';
var upload = multer({ dest: imagesLocation});
var fs =  require('fs');

var lastImageId;


/* GET home page. */
router.get('/', passport.ensureAuthenticated, function(req, res){
  // check if user name pass from login screen
  //console.log(req.user + ' authenticated');
  res.json({res:{message:'user ' + req.user + 'authenticated', tag: 'user authenticated'}, user: passport.removePassword(req.user)});
});

router.post('/add', upload.single('file'), function (req, res, next) {
    var myFile = req.file;


    var newImage = new db.Image({
        fieldname: myFile.fieldname,
        originalname: myFile.originalname,
        encoding: myFile.encoding,
        mimetype: myFile.mimetype,
        destination: myFile.destination,
        filename: myFile.filename,
        path: myFile.path,
        size: myFile.size
    });


    newImage.save(function (err, image) {
        if (!err) {
            if (image) {
               // console.log(image);
                console.log("This is image id" + image._id);
                lastImageId = image._id;
                console.log("This is file ID " + lastImageId);
                res.json(image);
            }
            else {
                res.json({message: "something went wrong in saving new post"});
            }
        }
        else {
            res.json({message: "something went wrong in saving new post"});
        }
    });


});

router.post('/register', function (req, res, next) {

  var user = req.body.user;
  var firstName = user.firstName;
  var lastName = user.lastName;
  var isAdmin = user.isAdmin;
  var dob = user.dob;
  var email = user.email;
  var password = req.body.password;
  var imagePath = "http://localhost:8000/files/download/" + lastImageId;


  db.User.find({email: email}, function(err, users){
    if(!err) {
      if (!users || users.length == 0) {
        var newUser = new db.User({
          firstName: firstName,
          lastName: lastName,
          image: imagePath,
          isAdmin: isAdmin,
          dob: dob,
          email: email,
          password: password,
        });

        //console.log(user + newUser);

        db.User.createUser(newUser, function(err, user){
          if (err)
            console.error("error saving" + err);
          else
            console.log('User created:' + user);
          res.json({res:{ message: "User name " + user.email + "has registered", tag:'login'}, user: passport.removePassword(user)});
        });
      }
      else{
       // console.log(user);

        console.log('User to be added already exists!');
        res.json({res: {message: "User name " + req.body.user.email + " already exists", tag:'user exists'}, user: undefined});
      }
    }
    else {
      next(err);
    }
  });
});

router.post('/login', function handleLocalAuthentication(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err)
    {
      return next(err);
    }
    if (!user) {
      var expUser = passport.removePassword(req.user);
      //console.log('lol     ' + expUser + '\n' + '\n' + '\n' + '\n' );
      var obj = {res: {message: "no user found", tag: 'no user found'}, user: passport.removePassword(req.user)};
      var str = JSON.stringify(obj);
      //console.log('lol     ' + str + '\n' + '\n' + '\n' + '\n' );

      return res.json({res: {message: "no user found", tag: 'no user found'}, user: passport.removePassword(req.user)});
    }

    // Manually establish the session...
    req.login(user, function(err) {
      if (err) return next(err);

      var expUser = passport.removePassword(req.user);
      return res.json({res:{message: 'user ' + expUser.email + ' is logged in', tag: 'logged in'}, user: expUser});
    });

  })(req, res, next);

});

router.get('/logout', function(req, res, next) {
  req.session.regenerate(function(err) {
    if(!err)
    {
      res.json({res: {message: 'user logged out', tag:'logged out'}, user: req.user});
    }
  });
});

module.exports = router;
