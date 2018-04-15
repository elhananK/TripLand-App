var express = require('express');
var db = require('../db');
var router = express.Router();
//var passport = require('../mypassport');
var multer = require('multer');
var imagesLocation = __dirname + '/../images';
var upload = multer({ dest: imagesLocation});
var fs =  require('fs');

var lastImageId;

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

    var textPost = req.body.textPost;
    var textTitle = req.body.textTitle;
    var groupId = req.body.groupId;
    var imagePath = "http://localhost:8000/files/download/" + lastImageId;
    var textUrl = req.body.textUrl;

    var newPost = new db.Post({
            title: textTitle,
            text: textPost,
            image: imagePath,
            groupId: groupId,
            userId: req.user,
            likes: "0",
            dislikes: "0",
            connectedUserFlag: false,
            linkUrl: textUrl,
            dateCreated:  Date.now()
        });

    newPost.save(function(err, post){
        if(!err){
            if(post)
            {
                db.Post.findById(post._id)
                    .populate('userId')
                    .exec(function (err, post) {
                        res.json(post);
                    })
            }
            else{
                res.json({message: "something went wrong in saving new post"});
            }
        }
        else {
            next(err);
        }
    });
});

router.post('/loggedInUsers', function (req, res, next) {

    var textPost = req.body.textPost;
    var textTitle = req.body.textTitle;
    var groupId = req.body.groupId;
    var imagePath = "http://localhost:8000/files/download/" + lastImageId;
    var textUrl = req.body.textUrl;

    console.log(textUrl);

    var newPost = new db.Post({
        title: textTitle,
        text: textPost,
        image: imagePath,
        groupId: groupId,
        userId: req.user,
        likes: "0",
        dislikes: "0",
        connectedUserFlag: true,
        linkUrl: textUrl,
        dateCreated:  Date.now()
    });

    newPost.save(function(err, post){
        if(!err){
            if(post)
            {
                db.Post.findById(post._id)
                    .populate('userId')
                    .exec(function (err, post) {
                        console.log(post);
                        res.json(post);
                    })
            }
            else{
                res.json({message: "something went wrong in saving new post"});
            }
        }
        else {
            next(err);
        }
    });
});

router.get('/:id', function (req, res, next) {

    curPostId = req.params.id;
    db.Post.findById(curPostId)
        .populate('comments')
        .populate('userId')
        .exec(function(err, post){
            if(err)
            {
                next(err);
            }
            else
            {
                if(!post)
                {
                    res.json({message: "There are no groups"});
                }
                else
                {
                    res.json(post);
                }
            }
        });

});

router.post('/:id/comment', function (req, res, next) {
    var text = req.body.text;
    var curUser = req.user;
    if(!curUser)
        console.log('curUser is not initialized');
    else         console.log(curUser);

    var newComment = new  db.Comment({
        text: text,
        ownerFN: curUser.firstName,
        ownerLN: curUser.lastName,
        ownerImage: curUser.image
    });
    newComment.save(function(err, comment){
        if(!err){
            if(comment)
            {
                        db.Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment }}, function (err, post) {
                                if (err)
                                    next(err);
                                else if (!post)
                                    res.json({message: "something went wrong in saving new comment"});
                                else
                                {
                                    db.Post.findById(req.params.id)
                                        .populate('comments')
                                        .exec(function (err, post) {
                                            //console.log(post);
                                            res.json(post);
                                        });
                                }
                            });
            }
            else{
                res.json({message: "something went wrong in saving new post"});
            }
        }
        else {
            next(err);
        }
    });
});

router.post('/:id/likes', function (req, res, next) {

    var op = req.body.op;
    var curUser = req.body.userId;

    db.Post.findById(req.params.id, function (err, post) {
        if(err)
        {
            next(err);
        }
        else if(!post){
            res.json({res: {message: 'invalid post id', tag: 'invalid post id'}, post: null});
        }
        else {
            db.User.getUserById(curUser, function (err, user) {
                {

                    //var userLikes = user.likes;
                    //var userDislikes = user.dislikes;
                    var postLikes = post.likes;
                    var postDislikes = post.dislikes;
                    var postid = req.params.id;
                    var userid = user._id;

                    if (op == 'pluslikeminusdislike') {
                        var del;
                        console.log(postid + " " + userid);
                        db.Likes.findOne({postId: postid, userId: userid}, function (err, continueSave) {
                            if (err)
                                next(err);
                            else if (continueSave) {
                                res.json({res: {message: "You Already Like This Post"}});
                            }
                            else {
                                db.DisLikes.findOne({postId: postid, userId: userid}, function (err, deleteDislike) {
                                    if (err)
                                        next(err);
                                    else if (deleteDislike) {
                                        postDislikes--;
                                        del = deleteDislike.id;
                                        db.Post.findByIdAndUpdate(req.params.id, {
                                            likes: postLikes,
                                            dislikes: postDislikes
                                        }, function (err, post) {
                                            if (err)
                                                next(err);
                                            else if (!post)
                                            {}
                                            else {
                                                db.User.findByIdAndUpdate(user._id, {$pop: {dislikes: deleteDislike}}, function (err, user) {
                                                    if (err)
                                                        next(err);
                                                    else if (!user){}
                                                });
                                            }
                                        });
                                    }
                                    if(del) {
                                        db.DisLikes.findByIdAndRemove({_id: del},function (err,likes) {
                                            if(err)
                                                next(err);
                                            else if(likes)
                                                console.log(likes);
                                            else if (!likes)
                                                console.log(likes);

                                        });
                                    }
                                        postLikes++;
                                        var newLike = new db.Likes({
                                            postId: postid,
                                            userId: userid
                                        });
                                        newLike.save(function (err, like) {
                                            if (!err) {
                                                if (like) {
                                                    db.Post.findByIdAndUpdate(req.params.id, {
                                                        likes: postLikes,
                                                        dislikes: postDislikes
                                                    }, function (err, post) {
                                                        if (err)
                                                            next(err);
                                                        else if (!post){}
                                                        else {
                                                            db.User.findByIdAndUpdate(user._id, {$push: {likes: like}}, function (err, user) {
                                                                if (err)
                                                                    next(err);
                                                                else if (!user){}
                                                                else {

                                                                    }

                                                            });
                                                            db.Post.findById(req.params.id,function (err,POST) {
                                                                if(POST) {
                                                                    res.json({post: POST});
                                                                }

                                                            });
                                                        }
                                                    });
                                                }
                                                else {

                                                }
                                            }
                                            else {
                                                next(err);
                                            }
                                        });


                                });

                                }
                        });
                   }
                    if (op == 'minuslikeplusdislike') {
                        console.log("enter to minuslikeplusdislike");
                        var dellike;
                        db.DisLikes.findOne({postId: postid, userId: userid}, function (err, continueSave) {
                            if (err)
                                next(err);
                            else if (continueSave) {
                                res.json({res: {message: "You Already DisLike This Post"}});
                            }
                            else {
                                db.Likes.findOne({postId: postid, userId: userid}, function (err, deletelike) {
                                    if (err)
                                        next(err);
                                    else if (deletelike) {
                                        postLikes--;
                                        dellike = deletelike.id;
                                        db.Post.findByIdAndUpdate(req.params.id, {
                                            likes: postLikes,
                                            dislikes: postDislikes
                                        }, function (err, post) {
                                            if (err)
                                                next(err);
                                            else if (!post){}
                                            else {
                                                db.User.findByIdAndUpdate(user._id, {$pop: {likes: deletelike}}, function (err, user) {
                                                    if (err)
                                                        next(err);
                                                    else if (!user){}
                                                });

                                            }
                                        });
                                    }

                                    if(dellike) {
                                        db.Likes.findByIdAndRemove({_id: dellike},function (err,likes) {
                                            if(err)
                                                next(err);
                                            else if(likes)
                                                console.log(likes);
                                            else if (!likes)
                                                console.log(likes);

                                        });
                                    }
                                    postDislikes++;
                                        var newDisLike = new db.DisLikes({
                                            postId: postid,
                                            userId: userid
                                        });
                                        newDisLike.save(function (err, dislike) {
                                            if (!err) {
                                                if (dislike) {
                                                    db.Post.findByIdAndUpdate(req.params.id, {
                                                        likes: postLikes,
                                                        dislikes: postDislikes
                                                    }, function (err, post) {
                                                        if (err)
                                                            next(err);
                                                        else if (!post)
                                                        {

                                                        }
                                                        else {
                                                            db.User.findByIdAndUpdate(user._id, {$push: {dislikes: dislike}}, function (err, user) {
                                                                if (err)
                                                                    next(err);
                                                                else if (!user){

                                                                }
                                                                else {
                                                                }
                                                            });
                                                            db.Post.findById(req.params.id,function (err,POST) {
                                                                if (POST) {
                                                                    res.json({post: POST});
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.json({message: "something went wrong in saving new like"});
                                                }
                                            }
                                            else {
                                                next(err);
                                            }
                                        });


                                });

                    }
                        });

                    }

    }
            });
        }
    });
});

router.post('/countLikes', function (req, res, next) {

    var userId = req.body.userId;
    var userImage = req.body.userImage;

    console.log(userId);

    db.Post.find({ userId:userId } , function (err, posts) {
        if (err)
            next(err);
        else if (posts) {
                    db.Comment.find({ownerImage: userImage} , function (err, comments) {
                        if (err)
                            next(err);
                        else if (comments) {
                            var countLikes = 0;
                            var countdisLikes = 0;
                            for (var x = 0, len = posts.length; x < len; x++) {
                                countLikes += posts[x].likes;
                                countdisLikes += posts[x].dislikes;
                            }
                            res.json({likes:countLikes, disLikes:countdisLikes,comments:comments.length});
                        }
                        else {

                        }
                    });

        }
        else {

        }
    });

    // db.Post.find({ userId:userId } , function (err, posts) {
    //     if (err)
    //         next(err);
    //     else if (posts) {
    //         db.DisLikes.find({ userId:userId } , function (err, dislikes) {
    //             if (err)
    //                 next(err);
    //             else if (dislikes) {
    //                 db.Comment.find({ownerImage: userImage} , function (err, comments) {
    //                     if (err)
    //                         next(err);
    //                     else if (comments) {
    //                         console.log(likes.length);
    //                         console.log(dislikes.length);
    //                         console.log(comments.length);
    //                         res.json({likes:likes.length, disLikes:dislikes.length,comments:comments.length});
    //                     }
    //                     else {
    //
    //                     }
    //                 });
    //             }
    //             else {
    //
    //             }
    //         });
    //     }
    //     else {
    //
    //     }
    // });



});


module.exports = router;
