"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var ng2_file_upload_1 = require("ng2-file-upload");
var popup_1 = require("@ngui/popup");
var app_component_1 = require("./app.component");
var navbar_component_1 = require("./components/navbar/navbar.component");
var user_component_1 = require("./components/user/user.component");
var home_component_1 = require("./components/home/home.component");
var post_component_1 = require("./components/post/post.component");
var group_detail_component_1 = require("./components/group-detail/group-detail.component");
var groups_component_1 = require("./components/groups/groups.component");
var add_group_component_1 = require("./components/add-group/add-group.component");
var user_service_1 = require("./shared/user.service");
var group_service_1 = require("./shared/group.service");
var post_service_1 = require("./shared/post.service");
var app_routing_1 = require("./app.routing");
var utils_service_1 = require("./shared/utils.service");
var files_component_1 = require("./components/files/files.component");
var socket_service_1 = require("./shared/socket.service");
var user_register_component_1 = require("./components/user-register/user-register.component");
var filter_pipe_1 = require("./filter.pipe");
var profile_component_1 = require("./components/profile/profile.component");
//import {AgmCoreModule} from "@agm/core";
// Google Maps
var core_2 = require("@agm/core");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            filter_pipe_1.FilterPipe,
            ng2_file_upload_1.FileSelectDirective,
            user_component_1.UserComponent,
            user_register_component_1.UserRegisterComponent,
            post_component_1.PostComponent,
            group_detail_component_1.GroupDetailComponent,
            groups_component_1.GroupsComponent,
            add_group_component_1.AddGroupComponent,
            home_component_1.HomeComponent,
            navbar_component_1.NavbarComponent,
            files_component_1.FilesComponent,
            profile_component_1.ProfileComponent,
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routing_1.AppRoutingModule,
            popup_1.NguiPopupModule,
            core_2.AgmCoreModule.forRoot({
                apiKey: 'AIzaSyB931vv4bgbiR3MeFMdzOIMC_RG01rCWjM',
                language: 'en'
            }),
        ],
        providers: [group_service_1.GroupService, post_service_1.PostService, user_service_1.UserService, utils_service_1.UtilsService, socket_service_1.SocketService, core_2.GoogleMapsAPIWrapper],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map