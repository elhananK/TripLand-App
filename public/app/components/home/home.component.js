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
var utils_service_1 = require("../../shared/utils.service");
var user_service_1 = require("../../shared/user.service");
var io = require("socket.io-client");
var popup_1 = require("@ngui/popup");
require("rxjs/Rx");
var HomeComponent = (function () {
    function HomeComponent(userService, utilsService) {
        this.userService = userService;
        this.utilsService = utilsService;
        this.branding = "TripLand App";
        this.window = utilsService.nativeWindow;
        this.socket = io.connect('http://localhost:8000');
    }
    HomeComponent.prototype.ngOnInit = function () {
        var self = this;
        this.userService.getCurUser()
            .then(function (user) {
            if (user) {
                self.curUser = user;
            }
        });
    };
    return HomeComponent;
}());
__decorate([
    core_1.ViewChild(popup_1.NguiPopupComponent),
    __metadata("design:type", popup_1.NguiPopupComponent)
], HomeComponent.prototype, "popup", void 0);
HomeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'home',
        templateUrl: 'home.component.html',
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        utils_service_1.UtilsService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map