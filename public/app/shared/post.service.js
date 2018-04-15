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
require("rxjs/add/operator/toPromise");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var PostService = (function () {
    function PostService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.groupsUrl = 'http://localhost:8000/groups'; // URL to web api
        this.postsUrl = 'http://localhost:8000/posts'; // URL to web api
    }
    PostService.prototype.getPosts = function () {
        return this.http.get(this.groupsUrl, { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    PostService.prototype.getPostByCurUser = function (id) {
        return this.http.get(this.groupsUrl + '/getPostByCurUser/' + id, { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    PostService.prototype.getPostsByGroupId = function (groupId) {
        return this.http.get(this.groupsUrl + '/' + groupId, { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    PostService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    PostService.prototype.getPost = function (id) {
        return this.http.get(this.postsUrl + '/' + id, { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    PostService.prototype.create = function (textPost, textTitle, textUrl, groupId) {
        return this.http
            .post(this.postsUrl, JSON.stringify({ textPost: textPost, textTitle: textTitle, textUrl: textUrl, groupId: groupId }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    PostService.prototype.createLoggedInUsers = function (textPost, textTitle, textUrl, groupId) {
        return this.http
            .post(this.postsUrl + '/loggedInUsers', JSON.stringify({ textPost: textPost, textTitle: textTitle, textUrl: textUrl, groupId: groupId }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    PostService.prototype.createComment = function (text, postId) {
        console.log(text);
        return this.http
            .post(this.postsUrl + '/' + postId + '/comment', JSON.stringify({ text: text }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    PostService.prototype.updateLikes = function (op, postId, userId) {
        return this.http
            .post(this.postsUrl + '/' + postId + '/likes', JSON.stringify({ op: op, userId: userId }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    PostService.prototype.countLikesAndDislikes = function (userId, userImage) {
        return this.http
            .post(this.postsUrl + '/countLikes', JSON.stringify({ userId: userId, userImage: userImage }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    return PostService;
}());
PostService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map