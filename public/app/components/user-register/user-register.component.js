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
var http_1 = require("@angular/http");
var user_1 = require("../../shared/user");
var user_service_1 = require("../../shared/user.service");
var utils_service_1 = require("../../shared/utils.service");
var ng2_file_upload_1 = require("ng2-file-upload");
var UserRegisterComponent = (function () {
    function UserRegisterComponent(userService, route, location, utilsService) {
        this.userService = userService;
        this.route = route;
        this.location = location;
        this.utilsService = utilsService;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.filesUrl = 'http://localhost:8000/add'; // URL to web api
        this.uploader = new ng2_file_upload_1.FileUploader({ url: this.filesUrl });
    }
    UserRegisterComponent.prototype.goBack = function () {
        this.location.back();
    };
    UserRegisterComponent.prototype.ngOnInit = function () {
        this.window = this.utilsService.nativeWindow;
        this.inputUser = {
            _id: '',
            firstName: 'Elhanan',
            lastName: 'Kalfa',
            image: 'invalid',
            isAdmin: false,
            groupIds: [],
            groupPendingName: [],
            groupPendingUser: [],
            groupWaiting: [],
            email: 'elhanan@gmail.com',
            //password: '1234',
            likes: [],
            dislikes: []
        };
        this.inputPassword = 'tkjbi';
    };
    UserRegisterComponent.prototype.register = function (firstName, lastName, password, emailName) {
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
        console.log(this.inputUser);
        console.log(this.inputPassword);
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
    UserRegisterComponent.prototype.getCurUser = function () {
        var self = this;
        this.userService.getCurUser()
            .then(function (user) {
            self.curUser = user;
            console.log(self.curUser);
        });
    };
    UserRegisterComponent.prototype.logout = function () {
        var self = this;
        this.userService.logout()
            .then(function (uRes) {
            console.log(uRes.res.message);
            self.curUser = uRes.user;
        });
    };
    // login(email:String, pass: String): void{
    //   var self = this;
    //   console.log(email + " " + pass);
    //   this.userService.login(email, pass)
    //       .then(function(uRes){
    //         console.log(uRes.res.message);
    //         self.curUser = uRes.user;
    //         self.window.location.href = "http://localhost:3000/"
    //       });
    UserRegisterComponent.prototype.login = function (email, pass) {
        var self = this;
        console.log(this.inputUser.email + " " + this.inputPassword);
        this.userService.login(this.inputUser.email, this.inputPassword)
            .then(function (uRes) {
            console.log(uRes.res.message);
            self.curUser = uRes.user;
            self.window.location.href = "http://localhost:3000/";
        });
    };
    return UserRegisterComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", user_1.User)
], UserRegisterComponent.prototype, "curUser", void 0);
UserRegisterComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-user',
        templateUrl: 'user-register.component.html' //,
        // styleUrls: [ './css/4-col-portfolio.css', './css/bootstrap.min.css', './css/thumbnail-gallery.css']
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        router_1.ActivatedRoute,
        common_1.Location,
        utils_service_1.UtilsService])
], UserRegisterComponent);
exports.UserRegisterComponent = UserRegisterComponent;
//# sourceMappingURL=user-register.component.js.map