var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = Schema({
    firstName: String,
    lastName: String,
    image: String,
    isAdmin: {type:Boolean, default: false},
    dob: Date,
    groupIds: [{ type: Schema.Types.ObjectId, ref: 'groupSchema' }],
    groupPendingName: [{ type: Schema.Types.ObjectId, ref: 'groupSchema' }],
    groupPendingUser: [{ type: Schema.Types.ObjectId, ref: 'userSchema' }],
    groupWaiting: [{ type: Schema.Types.ObjectId, ref: 'groupSchema' }],
    email: String,
    password: String,
    likes: [{type:Schema.Types.ObjectId, ref: 'Likes'}],
    dislikes: [{type:Schema.Types.ObjectId, ref: 'DisLikes'}],
});

var User = mongoose.model("User", userSchema);
User.userSchema = userSchema;
module.exports = User;


module.exports.createUser = function(newUser, callback){
    console.log('you enter to createUser');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    console.log('you enter to getUserByUsername');
    console.log(username);
    var query = {email: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    console.log('you enter to getUserById');
    User.findById(id, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        console.log('you enter to compare password using bcrypt to compare');
        console.log(candidatePassword + " HASH IS: " + hash);
        console.log(isMatch);
        if(err) throw err;
        console.log("you enter to callback function");
        callback(null, isMatch);
    });
}

// Function for updateUser!
module.exports.UpdateUser =  function(UpdatedUser,user,callback) {

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(UpdatedUser.password, salt, function (err, hash) {
            UpdatedUser.password = hash;
            User.update({_id: user._id},{
                firstName: UpdatedUser.firstName, lastName: UpdatedUser.lastName, image: UpdatedUser.image, isAdmin: UpdatedUser.isAdmin,
                dob: UpdatedUser.dob, groupIds: UpdatedUser.groupIds, email: UpdatedUser.email, password: hash, likes: UpdatedUser.likes,
                dislikes: UpdatedUser.dislikes
            },callback);
        });
    });
};


module.exports.PushPendingReq =  function(UpdatedUser,user,callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(UpdatedUser.password, salt, function (err, hash) {
            UpdatedUser.password = hash;
            User.update(
                {_id: user._id},
                { $push: {groupPendingName: UpdatedUser.groupPendingName, groupPendingUser: UpdatedUser.groupPendingUser}
                },callback);
        });
    });
};
module.exports.PushWaitingReq =  function(UpdatedUser,user,callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(UpdatedUser.password, salt, function (err, hash) {
            UpdatedUser.password = hash;
            User.update(
                {_id: user._id},
                { $push: {groupWaiting: UpdatedUser.groupWaiting}
                },callback);
        });
    });
};