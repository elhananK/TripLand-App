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
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.usersUrl = 'http://localhost:8000/users'; // URL to web api
        this.indexUrl = 'http://localhost:8000'; // URL to web api
    }
    UserService.prototype.getCurUser = function () {
        return this.http.get(this.usersUrl + '/cur_user', { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json().user; })
            .catch(this.handleError);
    };
    UserService.prototype.getUserById = function (id) {
        return this.http.get(this.usersUrl)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    UserService.prototype.register = function (user, password) {
        return this.http.post(this.indexUrl + '/register', JSON.stringify({ user: user, password: password }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    UserService.prototype.login = function (email, password) {
        return this.http.post(this.indexUrl + '/login', JSON.stringify({ username: email, password: password }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    UserService.prototype.logout = function () {
        return this.http.get(this.indexUrl + '/logout', { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    UserService.prototype.updateUser = function (user, password) {
        return this.http.post(this.usersUrl + '/update_user/' + user.email, JSON.stringify({ user: user, password: password }), { headers: this.headers, withCredentials: true })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    UserService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map