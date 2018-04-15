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
var post_1 = require("../../shared/post");
var group_service_1 = require("../../shared/group.service");
var post_service_1 = require("../../shared/post.service");
var PostComponent = (function () {
    function PostComponent(groupService, postService, route, location) {
        this.groupService = groupService;
        this.postService = postService;
        this.route = route;
        this.location = location;
    }
    PostComponent.prototype.goBack = function () {
        this.location.back();
    };
    PostComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.route.params
            .switchMap(function (params) { return _this.postService.getPost(params['id']); })
            .subscribe(function (post) {
            console.log(post);
            self.post = post;
            self.comments = post.comments;
        });
    };
    PostComponent.prototype.addComment = function (text) {
        var self = this;
        if (!text) {
            return;
        }
        this.postService.createComment(text, this.post._id)
            .then(function (post) {
            self.post = post;
            self.comments = post.comments;
        });
    };
    return PostComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", post_1.Post)
], PostComponent.prototype, "post", void 0);
PostComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-post',
        templateUrl: 'post.component.html',
        styleUrls: ['./css/4-col-portfolio.css', './css/bootstrap.min.css', './css/thumbnail-gallery.css']
    }),
    __metadata("design:paramtypes", [group_service_1.GroupService,
        post_service_1.PostService,
        router_1.ActivatedRoute,
        common_1.Location])
], PostComponent);
exports.PostComponent = PostComponent;
//# sourceMappingURL=post.component.js.map