var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');

passport.use(new LocalStrategy(
    function(username, password, done) {
        //console.log('you enter to passport (LocalStrategy)');
        //console.log(username + " " + password);
        db.User.getUserByUsername(username, function(err, user){
            if(err){
                console.log(err);
                throw err;
            }
            if(!user){
                console.log('!user');
                return done(null, false, {res:{message: 'Unknown User', tag: 'Unknown User'}, user: undefined});
            }

            console.log('here');

            db.User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    console.log('ismatch');
                    return done(null, user);
                } else {
                    return done(null, false, {res:{message: 'Invalid password', tag: 'Invalid password'}, user: undefined});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
   // console.log('you enter to serializeUser');
   // console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    //console.log('you enter to deserializeUser');
    db.User.findById(id, function(err, user) {
        if(err) console.log(err);
        else if(!user) console.log('err');
        //console.log(user);
        done(err, user);
    });
});

passport.ensureAuthenticated = function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if (req.isAuthenticated()) {
       // console.log(req.isAuthenticated())
        return next();
    }
    else {
        //req.flash('error_msg','You are not logged in');
        console.log('fail');
        return next();
        //res.json({res: {message: "user is not authenticated", tag:'login'}, user: undefined});
    }
};

passport.removePassword = function (user)
{
    var str = JSON.stringify(user)
    // console.log("this is STR !!!!!!!!!!!!!!!!!!!!------------------------------------------------------------");
    // console.log(str);
    // console.log("this is USER!!!!!!!!!!!!!!!!!!!!------------------------------------------------------------");
    // console.log(user.id);
    var removedPasseordUser =  !user || !user.email ? null : new db.User({
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        email: user.email,
        image: user.image,
        groupIds: user.groupIds,
        groupPending: user.groupPending,
        likes: user.likes,
        dislikes: user.dislikes
    });
    // console.log("this is remove passport!!!!!!!!!!!!!!!!!!!!------------------------------------------------------------");
    // console.log(removedPasseordUser.id);
    //console.log(removedPasseordUser);
    return removedPasseordUser;
};

module.exports = passport;