"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var home_component_1 = require("./components/home/home.component");
var group_detail_component_1 = require("./components/group-detail/group-detail.component");
var groups_component_1 = require("./components/groups/groups.component");
var post_component_1 = require("./components/post/post.component");
var user_component_1 = require("./components/user/user.component");
var files_component_1 = require("./components/files/files.component");
var add_group_component_1 = require("./components/add-group/add-group.component");
var user_register_component_1 = require("./components/user-register/user-register.component");
var profile_component_1 = require("./components/profile/profile.component");
var appRoutes = [
    { path: '', component: home_component_1.HomeComponent },
    { path: 'groups/:id', component: group_detail_component_1.GroupDetailComponent },
    { path: 'groups', component: groups_component_1.GroupsComponent },
    { path: 'posts/:id', component: post_component_1.PostComponent },
    { path: 'login', component: user_component_1.UserComponent },
    { path: 'register', component: user_register_component_1.UserRegisterComponent },
    { path: 'files', component: files_component_1.FilesComponent },
    { path: 'add-group', component: add_group_component_1.AddGroupComponent },
    { path: 'profile', component: profile_component_1.ProfileComponent }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(appRoutes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app.routing.js.map