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
var utils_service_1 = require("../../shared/utils.service");
var socket_service_1 = require("../../shared/socket.service");
var io = require("socket.io-client");
require("rxjs/Rx");
var router_1 = require("@angular/router");
var group_service_1 = require("../../shared/group.service");
var NavbarComponent = (function () {
    function NavbarComponent(userService, groupService, utilsService, socketService, router) {
        this.userService = userService;
        this.groupService = groupService;
        this.utilsService = utilsService;
        this.socketService = socketService;
        this.router = router;
        this.branding = "TripLand App";
        this.notifyArray = [];
        this.window = utilsService.nativeWindow;
        this.socket = io.connect('http://localhost:8000');
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var self = this;
        if (!self.curUser) {
            this.userService.getCurUser()
                .then(function (user) {
                if (user) {
                    self.curUser = user;
                    self.socket.emit('eventGetNotify', user);
                    self.socket.emit('eventNotify');
                    self.socket.emit('eventClear');
                    console.log(self.notifyArray);
                    if (user.groupIds.length > 0)
                        self.socketService.setRooms(user.groupIds);
                    self.groupService.getGroups().then(function (groups) {
                        self.socketService.setRoomsForAdminSub(groups, user._id);
                    });
                }
            });
        }
        self.socket.on('eventNotify', function (data) {
            console.log('enter to eventNotify');
            console.log(data);
            self.notifyArray = data;
        });
        this.socketService.NewNotifySubject.subscribe(function (data) {
            self.notifyArray = data;
        });
        this.socketService.NewNotifyLoggedInUsers.subscribe(function (data) {
            console.log(data);
            self.notifyArray.push(data);
        });
    };
    NavbarComponent.prototype.notifyApprove = function (approve) {
        var self = this;
        this.socket.emit('eventApproveUser', self.curUser._id, approve.userId, approve.groupId);
        var index = this.notifyArray.indexOf(approve);
        this.notifyArray.splice(index, 1);
        this.socketService.updateUserPending(self.curUser, approve.groupName);
    };
    NavbarComponent.prototype.GoToPost = function (approve) {
        var self = this;
        console.log(approve);
        self.router.navigate(['/posts', approve.url]);
        var index = this.notifyArray.indexOf(approve);
        this.notifyArray.splice(index, 1);
    };
    NavbarComponent.prototype.groupOk = function (approve) {
        var self = this;
        var index = this.notifyArray.indexOf(approve);
        this.notifyArray.splice(index, 1);
        this.userService.getCurUser().then(function (user) {
            self.socketService.updateGroup(user);
            self.socketService.setRooms(user.groupIds);
        });
    };
    NavbarComponent.prototype.logout = function () {
        var self = this;
        this.userService.logout()
            .then(function (uRes) {
            self.curUser = uRes.user;
            self.window.alert(uRes.res.message);
            self.window.location.href = "http://localhost:3000/";
        });
    };
    return NavbarComponent;
}());
NavbarComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'navbar',
        templateUrl: 'navbar.component.html',
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        group_service_1.GroupService,
        utils_service_1.UtilsService,
        socket_service_1.SocketService,
        router_1.Router])
], NavbarComponent);
exports.NavbarComponent = NavbarComponent;
//# sourceMappingURL=navbar.component.js.map