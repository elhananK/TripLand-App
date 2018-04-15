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
var router_1 = require("@angular/router");
require("rxjs/add/operator/toPromise");
var group_service_1 = require("../../shared/group.service");
var user_service_1 = require("../../shared/user.service");
var socket_service_1 = require("../../shared/socket.service");
var GroupsComponent = (function () {
    function GroupsComponent(router, groupService, userService, socketService) {
        this.router = router;
        this.groupService = groupService;
        this.userService = userService;
        this.socketService = socketService;
        this.notifyArray = [];
        this.someCustomEvent = new core_1.EventEmitter();
    }
    GroupsComponent.prototype.ngOnInit = function () {
        var self = this;
        this.userService.getCurUser()
            .then(function (user) {
            self.curUser = user;
        });
        this.getGroups();
        this.socketService.NewGroupSubject.subscribe(function (data) {
            self.curUser = data;
            //self.socketService.setRooms(self.curUser.groupIds);
        });
    };
    GroupsComponent.prototype.getGroups = function () {
        var _this = this;
        this.groupService.getGroups().then(function (groups) {
            _this.groups = groups;
        });
    };
    GroupsComponent.prototype.subscribe = function (group) {
        var _this = this;
        var selfe = this;
        if (!group._id) {
            return;
        }
        this.groupService.subscribe(group._id, group.adminId, selfe.curUser)
            .then(function (groupRes) {
            _this.ngOnInit();
            self.window.alert(groupRes.res.message);
            selfe.noti(group);
        });
    };
    GroupsComponent.prototype.noti = function (groupAdmin) {
        var self = this;
        this.socketService.broadcastSubscribe(self.curUser, groupAdmin);
    };
    GroupsComponent.prototype.gotoGroupDetail = function (group) {
        var selfe = this;
        selfe.selectedGroup = group;
        if (selfe.curUser.groupIds.indexOf(selfe.selectedGroup._id) > -1)
            selfe.router.navigate(['/groups', selfe.selectedGroup._id]);
        else
            self.window.alert("You Are Not Member Of " + selfe.selectedGroup.title + " Group");
    };
    GroupsComponent.prototype.gotoAddGroup = function () {
        this.router.navigate(['/add-group']);
    };
    return GroupsComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GroupsComponent.prototype, "someCustomEvent", void 0);
GroupsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'groups',
        templateUrl: 'groups.component.html',
        providers: [group_service_1.GroupService],
        styleUrls: ['./css/4-col-portfolio.css', './css/bootstrap.min.css', './css/thumbnail-gallery.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        group_service_1.GroupService,
        user_service_1.UserService,
        socket_service_1.SocketService])
], GroupsComponent);
exports.GroupsComponent = GroupsComponent;
//# sourceMappingURL=groups.component.js.map