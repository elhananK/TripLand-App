var User = require('./user');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project_final_db');//_' + generateDbSuffix());
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var groupSchema = Schema({
    title: String,
    image: String,
    adminId: String,
    numOfSubs: Number,
    dateCreated: { type: Date, default: Date.now }
});
var Group = mongoose.model("Group", groupSchema);

var commentSchema = Schema({
    text: String,
    ownerFN: String,
    ownerLN: String,
    ownerImage: String,
    date: { type: Date, default: Date.now }
});

var Comment = mongoose.model("Comment", commentSchema);

var imageSchema = Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
});

var Image = mongoose.model("Image", imageSchema);

var postSchema = Schema({
    title: String,
    text: String,
    image: String,
    groupId: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    connectedUserFlag: Boolean,
    linkUrl: String,
    dateCreated: { type: Date, default: Date.now }
});
var Post = mongoose.model("Post", postSchema);

var likesSchema = Schema({
    postId: {type: Schema.Types.ObjectId, ref: 'Post'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
});
var Likes = mongoose.model("Likes", likesSchema);

var dislikeSchema = Schema({
    postId: {type: Schema.Types.ObjectId, ref: 'Post'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
});
var DisLikes = mongoose.model("DisLikes", dislikeSchema);

var db = {
    groupSchema: groupSchema,
    Group: Group,
    userSchema: User.userSchema,
    User: User,
    commentSchema: commentSchema,
    Comment: Comment,
    postSchema: postSchema,
    Post: Post,
    imageSchema: imageSchema,
    Image: Image,
    likesSchema: likesSchema,
    Likes: Likes,
    dislikeSchema: dislikeSchema,
    DisLikes: DisLikes
};


function generateDbSuffix() {
    var generate = "";
    var randomId = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        generate += randomId.charAt(Math.floor(Math.random() * randomId.length));

    return generate;
}
module.exports = db;

