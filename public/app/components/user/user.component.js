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
var user_1 = require("../../shared/user");
var user_service_1 = require("../../shared/user.service");
var utils_service_1 = require("../../shared/utils.service");
var ng2_file_upload_1 = require("ng2-file-upload");
var UserComponent = (function () {
    function UserComponent(userService, route, location, utilsService) {
        this.userService = userService;
        this.route = route;
        this.location = location;
        this.utilsService = utilsService;
        this.filesUrl = 'http://localhost:8000/add'; // URL to web api
        this.uploader = new ng2_file_upload_1.FileUploader({ url: this.filesUrl });
    }
    UserComponent.prototype.goBack = function () {
        this.location.back();
    };
    UserComponent.prototype.ngOnInit = function () {
        this.window = this.utilsService.nativeWindow;
    };
    UserComponent.prototype.register = function (firstName, lastName, password, emailName) {
        var self = this;
        this.inputUser = {
            _id: '',
            firstName: firstName,
            lastName: lastName,
            image: 'invalid',
            isAdmin: false,
            groupIds: [],
            groupPendingName: [],
            groupPendingUser: [],
            groupWaiting: [],
            email: emailName,
            //password: password,
            likes: [],
            dislikes: []
        };
        this.inputPassword = password;
        this.userService.register(this.inputUser, this.inputPassword)
            .then(function (userRes) {
            if (userRes.res.tag == 'user authenticated' || userRes.res.tag == 'logged in') {
                self.curUser = userRes.user;
            }
            else if (userRes.res.tag == 'login') {
                self.userService.login(userRes.user.email, self.inputPassword)
                    .then(function (uRes) {
                    console.log(uRes.res.message);
                    self.curUser = uRes.user;
                    self.window.location.href = "http://localhost:3000/";
                });
            }
        });
    };
    UserComponent.prototype.getCurUser = function () {
        var self = this;
        this.userService.getCurUser()
            .then(function (user) {
            self.curUser = user;
        });
    };
    UserComponent.prototype.logout = function () {
        var self = this;
        this.userService.logout()
            .then(function (uRes) {
            console.log(uRes.res.message);
            self.curUser = uRes.user;
        });
    };
    UserComponent.prototype.login = function (email, pass) {
        var self = this;
        console.log(pass);
        this.userService.login(email, pass)
            .then(function (uRes) {
            console.log(uRes.res.message);
            self.curUser = uRes.user;
            self.window.location.href = "http://localhost:3000/";
        });
    };
    UserComponent.prototype.log = function () {
        var self = this;
        this.userService.login("Elhananxxx@gmail.com", "tkjbi123")
            .then(function (uRes) {
            console.log(uRes.res.message);
            self.curUser = uRes.user;
            self.window.location.href = "http://localhost:3000/";
        });
    };
    return UserComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", user_1.User)
], UserComponent.prototype, "curUser", void 0);
UserComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-user',
        templateUrl: 'user.component.html' //,
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        router_1.ActivatedRoute,
        common_1.Location,
        utils_service_1.UtilsService])
], UserComponent);
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map