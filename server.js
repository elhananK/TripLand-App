function makeServer(port) {


    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var db = require('./server/db');
    var passport = require('./server/mypassport');
    var flash = require('connect-flash');
    var Rx = require('Rx');
    var connectMongo = require('connect-mongo');
    var mongoose = require('mongoose');
    var sharedsession = require("express-socket.io-session");


    mongoose.Promise = global.Promise;

    var MongoStore = connectMongo(session);
    var sessConnStr = "mongodb://localhost/project_sessions";
    var sessionConnect = mongoose.createConnection();
    sessionConnect.open(sessConnStr);



// mqtt - LAST TECH

    var mqtt = require('mqtt');
    var clientId = 'mqtt_' + 8000;

    var client = mqtt.connect('mqtt://localhost:1883', {clientId: clientId, connectTimeout: 30 * 1000000});

    client.on('connect', function () {
        client.subscribe('crossServers');
    });



    client.on('message', function (topic, message) {

        if (topic == 'crossServers') {
            var stringBuf = message.toString('utf-8');
            var mqttMsg = JSON.parse(stringBuf);
            if (mqttMsg.clientId != clientId) {
                mqttMsg.clientId = undefined;
                console.log("inside client.on('message',");
                console.log(mqttMsg.roomName);
                io.sockets.in(mqttMsg.roomName).emit(mqttMsg.eventName, mqttMsg.msg);
            }
        }
    });


    var index = require('./server/routes/index');
    var users = require('./server/routes/users');
    var groups = require('./server/routes/groups');
    var posts = require('./server/routes/posts');
    var files = require('./server/routes/files');
    var socketUser = db.User.userSchema;

    var userArray = [];
    var groupArray = [];
    var imageNotify = [];
    var groupIdArray = [];
    var userIdArray = [];


    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);

// view engine setup
    app.set('views', path.join(__dirname, 'server/views'));
    app.set('view engine', 'ejs');

    app.use(logger('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.static(path.join(__dirname, 'public')));


    app.use(cookieParser());



    // app.use(session({
    //     saveUninitialized: true, // saved new sessions
    //     resave: true, // do not automatically write to the session store
    //     secret: 'my-secret',
    //     cookie: {httpOnly: true, maxAge: 2419200000} // configure when sessions expires
    //
    // }));

    var shared_session = session({
        secret: "my special secret",
        resave: false,
        saveUninitialized: false,
        rolling: true,
        store: new MongoStore({ mongooseConnection: sessionConnect }),
        cookie: { maxAge: 604800000, httpOnly: true, sameSite: true } //cookie for one week
    });

    app.use(shared_session);
    io.use(sharedsession(shared_session));




// Passport init
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());


    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });

    app.use('/', index);
    app.use('/users', users);
    app.use('/groups', groups);
    app.use('/posts', posts);
    app.use('/files', files);


// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render he error page
        res.status(err.status || 500);
        res.render('error');
    });



    io.on('connection', function (socket, session) {


        socket.on('eventGetNotify', function (user) {

            socketUser = user;

            console.log(socketUser.groupPendingName.length);
            if (socketUser.groupPendingName.length > 0) {
                console.log('hi im inside if of eventGetNotify');
                for (var i = 0, len = socketUser.groupPendingName.length; i < len; i++) {
                    db.User.findById(socketUser.groupPendingUser[i], function (err, user) {
                        if (!err) {
                            if (!user) {

                            }
                            else {

                                userIdArray.push(user._id);
                                userArray.push(user.firstName);
                                imageNotify.push(user.image);
                            }
                        }
                        else {
                            next(err);
                        }
                    });
                    db.Group.findById(socketUser.groupPendingName[i], function (err, group) {
                        if (!err) {
                            if (!group) {

                            }
                            else {
                                groupIdArray.push(group.id);
                                groupArray.push(group.title);
                            }
                        }
                        else {
                            next(err);
                        }
                    });
                }
            }

            // console.log("inside eventGetNotify");
            // client.publish('crossServers', JSON.stringify({msg: "Hello im port 8000", clientId:clientId}));

        });

        socket.on('eventNotify', function () {
            var temp = [];
            var obj;
            console.log(userArray.length);
            if (userArray.length > 0) {
                for (var x = 0, len = userArray.length; x < len; x++) {
                    obj = {
                        userName: userArray[x],
                        groupName: groupArray[x],
                        image: imageNotify[x],
                        groupId: groupIdArray[x],
                        userId: userIdArray[x],
                        text: userArray[x] + " Wants To Join " + groupArray[x] + " Group",
                        url: ' ',
                        button: 'Approve'
                    };
                    temp.push(obj);
                }
                console.log('i make it to before emit');
                socket.emit('eventNotify', temp);
            }

        });

        socket.on('eventClear', function () {

            for (var x = 0, len = userArray.length; x < len; x++) {
                userArray.pop();
                groupArray.pop();
                imageNotify.pop();
                groupIdArray.pop();
                userIdArray.pop();
            }
        });

        socket.on('eventApproveUser', function (curUserid, userToApprove, groupToAppove) {


            var useridToApprove = userToApprove;
            var curuser = curUserid;
            var groupid = groupToAppove;

            db.User.findById(useridToApprove, function (err, userToApprove) {
                if (!err) {
                    if (!userToApprove) {

                    }
                    else {
                        db.User.findById(curuser, function (err, user) {
                            if (!err) {
                                if (!user) {

                                }
                                else {
                                    var indexOfCurUser = userToApprove.groupWaiting.indexOf(groupid);
                                    var indexOfAdminUser = user.groupPendingName.indexOf(groupid);
                                    user.groupPendingName.splice(indexOfAdminUser, 1);
                                    user.groupPendingUser.splice(indexOfAdminUser, 1);
                                    userToApprove.groupWaiting.splice(indexOfCurUser, 1);

                                    db.User.findByIdAndUpdate(curuser, {
                                        groupPendingName: user.groupPendingName,
                                        groupPendingUser: user.groupPendingUser

                                    }, function (err, updatedUser) {
                                        if (err)
                                            next(err);
                                        else if (!updatedUser) {

                                        }
                                        else {
                                            db.User.findByIdAndUpdate(useridToApprove, {
                                                groupWaiting: userToApprove.groupWaiting,
                                                $push: {groupIds: groupid}

                                            }, function (err, updatedUser) {
                                                if (err)
                                                    next(err);
                                                else if (!updatedUser) {

                                                }
                                                else {


                                                }
                                            });


                                        }
                                    });
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

        socket.on('joinRooms', function (userGroupIds) {

            for (var i = 0, len = userGroupIds.length; i < len; i++) {
                db.Group.findById(userGroupIds[i], function (err, group) {
                    if (!err) {
                        if (!group) {

                        }
                        else {
                            socket.join("room-" + group.title);
                        }
                    }
                    else {
                        next(err);
                    }
                });
            }

        });

        socket.on('joinRoomsForGroupAdmin', function (groupName) {

            socket.join("room-admin-" + groupName);
        });

        socket.on('broadcastSubscribe', function (curUser, group) {

            // when user subscribe the user who is the group admin get an notification - when we wants
            // to approve this user we need to sent him information about the approval so i assign him to room-pending
            socket.join("room-user-pending-" + group.title);


            obj = {
                userName: curUser.firstName,
                groupName: group.title,
                image: curUser.image,
                groupId: group._id,
                userId: curUser._id,
                text: curUser.firstName + " Wants To Join " + group.title + " Group",
                url: ' ',
                button: 'Approve'
            };
            var mqttmsg = {msg: obj, roomName: "room-admin-" + group.title, eventName: 'sentNotifyAfterSubscribe', clientId:clientId};
            io.sockets.in("room-admin-" + group.title).emit('sentNotifyAfterSubscribe', obj);
            console.log(mqttmsg);
            client.publish('crossServers', JSON.stringify(mqttmsg));


        });

        socket.on('broadcastPending', function (approveUser, groupName) {

            obj = {
                userName: approveUser.firstName,
                groupName: groupName,
                image: approveUser.image,
                groupId: " ",
                userId: approveUser.userId,
                text: approveUser.firstName + " Agreed Join You To " + groupName + " Group",
                url: ' ',
                button: 'OK'
            };
            io.sockets.in("room-user-pending-" + groupName).emit('sentApproveAfterSubscribe', obj);
            var mqttmsg = {msg: obj, roomName: "room-user-pending-" + groupName, eventName: 'sentApproveAfterSubscribe',clientId:clientId};
            client.publish('crossServers', JSON.stringify(mqttmsg));
        });

        socket.on('broadcastPost', function (userRoomIds, url, userId) {

            var obj;
            if (userRoomIds) {
                db.User.findById(userId, function (err, user) {
                    if (!err) {
                        if (!user) {
                        }
                        else {
                            db.Group.findById(userRoomIds, function (err, group) {
                                if (!err) {
                                    if (!group) {

                                    }
                                    else {
                                        obj = {
                                            userName: user.firstName,
                                            groupName: group.name,
                                            image: user.image,
                                            groupId: ' ',
                                            userId: user._id,
                                            text: user.firstName + " Published A Post For Logged-In User Only Click To See:",
                                            url: url,
                                            button: 'Go To Post'
                                        };
                                        io.sockets.in("room-" + group.title).emit('sentPostToConnectedUsersOnly', obj);
                                        var mqttmsg = {msg: obj, roomName: "room-" + group.title, eventName: 'sentPostToConnectedUsersOnly',clientId:clientId};
                                        client.publish('crossServers', JSON.stringify(mqttmsg));
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

            }

        });


    });

    server.listen(port, function () {
        console.log("Listening on port " + port);

    });

}


makeServer(8000);
//makeServer(8080);


