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
var io = require("socket.io-client");
var Subject_1 = require("rxjs/Subject");
var SocketService = (function () {
    function SocketService() {
        this.notifyArray = [];
        this.NewGroupSubject = new Subject_1.Subject();
        this.NewNotifySubject = new Subject_1.Subject();
        this.NewNotifyLoggedInUsers = new Subject_1.Subject();
        this.socket = io.connect('http://localhost:8000');
        var self = this;
        self.socket.on('eventNotify', function (data) {
            self.notifyArray = data;
            self.NewNotifySubject.next(self.notifyArray);
        });
        self.socket.on('sentNotifyAfterSubscribe', function (data) {
            self.NewNotifyLoggedInUsers.next(data);
        });
        self.socket.on('sentApproveAfterSubscribe', function (data) {
            self.NewNotifyLoggedInUsers.next(data);
        });
        self.socket.on('sentPostToConnectedUsersOnly', function (data) {
            self.NewNotifyLoggedInUsers.next(data);
        });
    }
    SocketService.prototype.setNotification = function (user) {
        var self = this;
        self.socket.emit('eventGetNotify', user);
        self.socket.emit('eventNotify');
        self.socket.emit('eventClear');
    };
    SocketService.prototype.notifyPostToLoggedUsers = function (groupId, url, userId) {
        var self = this;
        console.log(url);
        self.socket.emit('broadcastPost', groupId, url, userId);
    };
    SocketService.prototype.setRooms = function (groupIds) {
        this.socket.emit('joinRooms', groupIds);
    };
    SocketService.prototype.updateUserPending = function (approveUser, groupName) {
        this.socket.emit('broadcastPending', approveUser, groupName);
    };
    SocketService.prototype.setRoomsForAdminSub = function (groupsAdmin, userId) {
        for (var i = 0, len = groupsAdmin.length; i < len; i++) {
            if (groupsAdmin[i].adminId == userId) {
                this.socket.emit('joinRoomsForGroupAdmin', groupsAdmin[i].title);
            }
        }
    };
    SocketService.prototype.broadcastSubscribe = function (curUser, group) {
        this.socket.emit('broadcastSubscribe', curUser, group);
    };
    SocketService.prototype.updateGroup = function (data) {
        this.NewGroupSubject.next(data);
    };
    return SocketService;
}());
SocketService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], SocketService);
exports.SocketService = SocketService;
//# sourceMappingURL=socket.service.js.map