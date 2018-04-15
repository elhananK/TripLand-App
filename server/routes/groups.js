
var express = require('express');
var db = require('../db');
var user = require('../user');
var router = express.Router();
var multer = require('multer');
var imagesLocation = __dirname + '/../images';
var upload = multer({ dest: imagesLocation});
var fs =  require('fs');

var curGroupId;
var flag = false;
var lastImageId = null;

router.get('/', function(req, res, next) {

    db.Group.find(function(err, groups){
        if(err)
        {
            next(err);
        }
        else
        {
            if(!groups)
            {
                res.json({message: "There are no groups"});
            }
            else
            {
                res.json(groups);
            }
        }
    });
});

router.get('/:id', function(req, res, next) {

    curGroupId = req.params.id;
    db.Post.find({groupId: curGroupId,connectedUserFlag:flag})
        .populate('comments')
        .exec(function(err, groupPosts){
        if(err)
        {
            next(err);
        }
        else
        {
            if(!groupPosts)
            {
                res.json({message: "There are no groups"});
            }
            else
            {
                res.json(groupPosts);
            }
        }
    });
});

router.get('/getPostByCurUser/:id', function(req, res, next) {

    curUserId = req.params.id;
    db.Post.find({userId: curUserId,connectedUserFlag:false})
        .populate('comments')
        .exec(function(err, UserPosts){
            if(err)
            {
                next(err);
            }
            else
            {
                if(!UserPosts)
                {
                    res.json({message: "There are no groups"});
                }
                else
                {
                    res.json(UserPosts);
                }
            }
        });
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
                lastImageId = image._id;
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

router.post('/', function (req, res, next) {

    var groupTitle = req.body.text;
    var adminId = req.user.id;
    var imagePath;
    if(lastImageId){
        imagePath = "http://localhost:8000/files/download/" + lastImageId;
        console.log("enter to if");
    }
        else{
        imagePath = "http://www.geonames.org/flags/x/" + req.body.img + ".gif";
        console.log("enter to else");

    }


     var newGroup = new db.Group({
         title: groupTitle,
         image: imagePath,
         adminId: adminId,
    });

     newGroup.save(function(err, group){
        if(!err){
            if(group)
            {
                db.User.findByIdAndUpdate(adminId,{$push:{groupIds:group._id}},function (user) {
                    res.json({res:{message: "successfully saved new group"}});
                    lastImageId = null;
                });
            }
            else{
                res.json({res:{message: "something went wrong in saving new group"}});
            }
        }
        else {
            next(err);
        }
    });
});

router.post('/subscribe', function (req, res, next) {

    var groupId = req.body.groupId; // group ID
    var groupAdmin = req.body.groupAdmin; // group Admin ID
    var userId = req.body.user._id; // curUser ID to be subscribe
    var UserWhoSubscribe = req.body.user;



    console.log(groupAdmin + "This is GroupAdmin");
    db.User.findById(groupAdmin, function(err, userAdmin){
        if(!err)
        {
            if(!userAdmin)
            {
                res.json({message: "User name doesn't exists"});
            }
            else {
                var updateAdminUser = new db.User({
                    _id: userAdmin._id,
                    firstName: userAdmin.firstName,
                    lastName: userAdmin.lastName,
                    image: userAdmin.image,
                    isAdmin: userAdmin.isAdmin,
                    dob: userAdmin.dob,
                    groupPendingName: groupId,
                    groupPendingUser:userId,
                    email: userAdmin.email
                });
                var updateUserWhoSubscribe = new db.User({
                    _id: userId._id,
                    firstName: userId.firstName,
                    lastName: userId.lastName,
                    image: userId.image,
                    isAdmin: userId.isAdmin,
                    dob: userId.dob,
                    groupWaiting: groupId,
                    email: user.email
                });
                db.User.PushPendingReq(updateAdminUser,userAdmin, function(err, user){
                    if(!err){
                        if(user)
                        {
                            db.User.PushWaitingReq(updateUserWhoSubscribe,UserWhoSubscribe, function(err, user){
                                if(!err){
                                    if(user)
                                    {
                                        res.json({res:{message: "You Subscribed To This Group!"}});
                                    }
                                    else{
                                        res.json({res:{message: "something went wrong with updating user"}});
                                    }
                                }
                                else {
                                    next(err);
                                }
                            });
                        }
                        else{
                        }
                    }
                    else {
                        next(err);
                    }
                });
            }
        }
        else {
            next(err);
        }
    });






});


module.exports = router;
