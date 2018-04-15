"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/switchMap");
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var Group_1 = require("../../shared/Group");
var group_service_1 = require("../../shared/group.service");
var post_service_1 = require("../../shared/post.service");
var ng2_file_upload_1 = require("ng2-file-upload");
var socket_service_1 = require("../../shared/socket.service");
var user_service_1 = require("../../shared/user.service");
var GroupDetailComponent = (function () {
    function GroupDetailComponent(groupService, postService, route, location, router, socketService, userService) {
        this.groupService = groupService;
        this.postService = postService;
        this.route = route;
        this.location = location;
        this.router = router;
        this.socketService = socketService;
        this.userService = userService;
        this.checkBoxValue = false;
        this.filesUrl = 'http://localhost:8000/posts/add'; // URL to web api
        this.uploader = new ng2_file_upload_1.FileUploader({ url: this.filesUrl });
    }
    GroupDetailComponent.prototype.getPostsByGroupId = function () {
        var _this = this;
        var self = this;
        this.postService.getPostsByGroupId(this.group._id).then(function (posts) {
            _this.posts = posts;
            console.log(self.posts);
        });
    };
    GroupDetailComponent.prototype.getPosts = function () {
        var _this = this;
        var self = this;
        this.postService.getPosts().then(function (posts) {
            _this.posts = posts;
            console.log(self.posts);
        });
    };
    GroupDetailComponent.prototype.goBack = function () {
        this.location.back();
    };
    GroupDetailComponent.prototype.gotoPostDetail = function (post) {
        this.selectedPost = post;
        this.router.navigate(['/posts', this.selectedPost._id]);
    };
    GroupDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.route.params
            .switchMap(function (params) { return _this.groupService.getGroup(params['id']); })
            .subscribe(function (group) {
            self.group = group;
            self.getPostsByGroupId();
        });
        this.userService.getCurUser().then(function (user) {
            self.curUser = user;
        });
    };
    GroupDetailComponent.prototype.add = function (textPost, textTitle, textUrl) {
        var _this = this;
        var self = this;
        console.log(textUrl);
        if (this.checkBoxValue == false) {
            if (!textPost) {
                return;
            }
            if (textUrl) {
                console.log(textUrl);
                this.postService.create(textPost, textTitle, textUrl, this.group._id)
                    .then(function (post) {
                    _this.posts.push(post);
                });
            }
            else {
                textUrl = ' ';
                this.postService.create(textPost, textTitle, textUrl, this.group._id)
                    .then(function (post) {
                    _this.posts.push(post);
                });
            }
        }
        else if (this.checkBoxValue == true) {
            if (!textPost) {
                return;
            }
            console.log(this.checkBoxValue);
            if (textUrl) {
                console.log(textUrl);
                this.postService.createLoggedInUsers(textPost, textTitle, textUrl, this.group._id)
                    .then(function (post) {
                    self.socketService.notifyPostToLoggedUsers(post.groupId, post._id, post.userId._id);
                });
            }
            else {
                textUrl = ' ';
                this.postService.createLoggedInUsers(textPost, textTitle, textUrl, this.group._id)
                    .then(function (post) {
                    self.socketService.notifyPostToLoggedUsers(post.groupId, post._id, post.userId._id);
                });
            }
        }
    };
    GroupDetailComponent.prototype.Like = function (postId) {
        var post = this.posts.find(function (post) { return post._id == postId; });
        var myPostIndex = this.posts.findIndex(function (myPost) { return myPost == post; });
        var selfe = this;
        this.postService.updateLikes("pluslikeminusdislike", postId, selfe.curUser._id)
            .then(function (postRes) {
            if (postRes.post) {
                console.log("hi i made it to postRes.post");
                selfe.posts[myPostIndex] = postRes.post;
            }
            else if (postRes.res)
                self.window.alert(postRes.res.message);
        });
    };
    GroupDetailComponent.prototype.Dislike = function (postId) {
        var post = this.posts.find(function (post) { return post._id == postId; });
        var myPostIndex = this.posts.findIndex(function (myPost) { return myPost == post; });
        var selfe = this;
        this.postService.updateLikes("minuslikeplusdislike", postId, selfe.curUser._id)
            .then(function (postRes) {
            {
                if (postRes.post)
                    selfe.posts[myPostIndex] = postRes.post;
                else if (postRes.res)
                    self.window.alert(postRes.res.message);
            }
        });
    };
    return GroupDetailComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Group_1.Group)
], GroupDetailComponent.prototype, "group", void 0);
GroupDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-group-detail',
        templateUrl: 'group-detail.component.html',
    }),
    __metadata("design:paramtypes", [group_service_1.GroupService,
        post_service_1.PostService,
        router_1.ActivatedRoute,
        common_1.Location,
        router_1.Router,
        socket_service_1.SocketService,
        user_service_1.UserService])
], GroupDetailComponent);
exports.GroupDetailComponent = GroupDetailComponent;
//# sourceMappingURL=group-detail.component.js.map