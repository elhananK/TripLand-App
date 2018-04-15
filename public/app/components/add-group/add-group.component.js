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
var core_1 = require("@angular/core");
var ng2_file_upload_1 = require("ng2-file-upload");
var http_1 = require("@angular/http");
var Group_1 = require("../../shared/Group");
var group_service_1 = require("../../shared/group.service");
var user_service_1 = require("../../shared/user.service");
var AddGroupComponent = (function () {
    function AddGroupComponent(http, groupService, userService) {
        this.http = http;
        this.groupService = groupService;
        this.userService = userService;
        this.title = 'My Google Maps API';
        this.lat = 32.0853;
        this.lng = 34.7818;
        this.filesUrl = 'http://localhost:8000/groups/add'; // URL to web api
        this.uploader = new ng2_file_upload_1.FileUploader({ url: this.filesUrl });
    }
    AddGroupComponent.prototype.ngOnInit = function () {
        var self = this;
        this.userService.getCurUser()
            .then(function (user) {
            self.curUser = user;
            console.log(self.curUser);
        });
    };
    ;
    AddGroupComponent.prototype.AddGroup = function (text) {
        console.log(text);
        if (!text) {
            return;
        }
        this.groupService.createGroup(text, this.country_shortName)
            .then(function (uRes) {
            self.window.alert(uRes.res.message);
            console.log(uRes.res.message);
            self.window.location.href = "http://localhost:3000/groups";
        });
    };
    AddGroupComponent.prototype.mapClicked = function ($event) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;
        this.findCountryNameByLatLng(this.lat, this.lng);
    };
    AddGroupComponent.prototype.findCountryNameByLatLng = function (lat, lng) {
        var self = this;
        if (navigator.geolocation) {
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, lng);
            var request = { latLng: latlng };
            geocoder.geocode(request, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                                if (results[0].address_components[i].types[b] == "country") {
                                    //this is the object you are looking for
                                    self.country_shortName = results[0].address_components[i].short_name.toLowerCase();
                                    self.country_longName = results[0].address_components[i].long_name;
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }
    };
    AddGroupComponent.prototype.findLatLngByCountryName = function () {
        var self = this;
        if (navigator.geolocation) {
            var geocoder = new google.maps.Geocoder();
            var request = { address: self.country_longName.toString() };
            console.log(request);
            geocoder.geocode(request, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    self.lat = results[0].geometry.location.lat();
                    self.lng = results[0].geometry.location.lng();
                    self.findCountryNameByLatLng(self.lat, self.lng);
                }
                else {
                    console.log('error');
                }
            });
        }
    };
    return AddGroupComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Group_1.Group)
], AddGroupComponent.prototype, "inputGroup", void 0);
AddGroupComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-add-group',
        templateUrl: 'add-group.component.html',
    }),
    __metadata("design:paramtypes", [http_1.Http,
        group_service_1.GroupService,
        user_service_1.UserService])
], AddGroupComponent);
exports.AddGroupComponent = AddGroupComponent;
//# sourceMappingURL=add-group.component.js.map