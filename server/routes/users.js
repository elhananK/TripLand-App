var express = require('express');
var router = express.Router();
var db = require('../db');
var session = require('express-session');
var passport = require('../mypassport');
//yitzchak: 58d6bbc4f2184f05f7bd1f6c

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User.find(function(err, users){
    if(!err)
    {
      if(users)
      {
        res.json(users);
      }
      else {
        res.json({message: "There are not any users"});
      }
    }
    else {
      next(err);
    }
  });
});

router.get('/cur_user', passport.ensureAuthenticated, function(req, res, next) {
    res.json({user: req.user , ses: req.session});
    // passport.removePassword(req.user)
});


router.get('/:id', function(req, res, next) {

  //if(!curuser)...
  db.User.findById(req.params.id, function(err, user){
    if(!err)
    {
      if(!user)
      {
        res.json({message: "User name doesn't exists"});
      }
      else {
        res.json(passport.removePassword(user));
      }
    }
    else {
      next(err);
    }
  });
});



// Edit User
router.post('/update_user/:email', function (req, res, next) {
  console.log('you enter post edituser');
  console.log(req.params.email);

  User.getUserByUsername(req.params.email, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(req.body.password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){

        User.UpdateUser(req.body.user, user, function(err){
          if (err)
            throw err;
          else{
            res.json({message:'user updated', tag: 'user updated'});
          }
        });

      } else {
        res.json({message:'wrong password', tag: 'wrong password'});
      }
    });
  });
});



module.exports = router;
