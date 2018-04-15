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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var Subject_1 = require("rxjs/Subject");
var GroupService = (function () {
    function GroupService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.groupsUrl = 'http://localhost:8000/groups'; // URL to web api
        this.NewGroupSubject = new Subject_1.Subject();
    }
    GroupService.prototype.getGroups = function () {
        return this.http.get(this.groupsUrl, { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    GroupService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    GroupService.prototype.getGroup = function (id) {
        return this.getGroups().then(function (groups) {
            return groups.find(function (group) { return group._id === id; });
        });
    };
    GroupService.prototype.createGroup = function (text, img) {
        return this.http
            .post(this.groupsUrl, JSON.stringify({ text: text, img: img }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    GroupService.prototype.subscribe = function (groupId, groupAdmin, user) {
        return this.http
            .post(this.groupsUrl + "/subscribe", JSON.stringify({ groupId: groupId, groupAdmin: groupAdmin, user: user }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    return GroupService;
}());
GroupService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map