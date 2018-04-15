import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { GroupsComponent } from './components/groups/groups.component';
import { PostComponent } from "./components/post/post.component";
import { UserComponent } from "./components/user/user.component";
import { FilesComponent } from "./components/files/files.component";
import { AddGroupComponent } from "./components/add-group/add-group.component";
import { UserRegisterComponent } from "./components/user-register/user-register.component";
import * as path from "path";
import {ProfileComponent} from "./components/profile/profile.component";



const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'groups/:id', component: GroupDetailComponent},
    {path: 'groups', component: GroupsComponent},
    {path: 'posts/:id', component: PostComponent},
    {path: 'login', component: UserComponent},
    {path: 'register', component: UserRegisterComponent},
    {path: 'files', component: FilesComponent},
    {path: 'add-group', component: AddGroupComponent},
    {path: 'profile', component: ProfileComponent}

];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule{


}
