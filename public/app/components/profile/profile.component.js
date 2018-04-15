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
var core_1 = require("@angular/core");
var user_service_1 = require("../../shared/user.service");
var post_service_1 = require("../../shared/post.service");
var ProfileComponent = (function () {
    function ProfileComponent(userService, postService) {
        this.userService = userService;
        this.postService = postService;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        var self = this;
        this.userService.getCurUser().then(function (user) {
            self.curUser = user;
            console.log(user);
            self.postService.getPostByCurUser(user._id).then(function (posts) { return self.posts = posts; });
            self.postService.countLikesAndDislikes(self.curUser._id, self.curUser.image).then(function (likes) {
                console.log(likes);
                self.likesCounter = likes;
            });
        });
    };
    return ProfileComponent;
}());
ProfileComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'profile',
        templateUrl: 'profile.component.html',
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        post_service_1.PostService])
], ProfileComponent);
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map