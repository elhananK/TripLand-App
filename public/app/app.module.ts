import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FileSelectDirective } from 'ng2-file-upload';
import { NguiPopupModule } from '@ngui/popup';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { PostComponent } from "./components/post/post.component";
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { GroupsComponent } from './components/groups/groups.component';
import { AddGroupComponent } from './components/add-group/add-group.component';

import { UserService } from "./shared/user.service";
import { GroupService } from './shared/group.service';
import { PostService } from './shared/post.service'

import { AppRoutingModule } from './app.routing';
import { UtilsService} from "./shared/utils.service";
import { FilesComponent} from "./components/files/files.component";

import { SocketService } from './shared/socket.service';
import { UserRegisterComponent } from "./components/user-register/user-register.component";
import { FilterPipe } from './filter.pipe';
import { ProfileComponent } from "./components/profile/profile.component";
//import {AgmCoreModule} from "@agm/core";
// Google Maps
import {AgmCoreModule, GoogleMapsAPIWrapper} from "@agm/core";



@NgModule({
    declarations: [
        AppComponent,
        FilterPipe,
        FileSelectDirective,
        UserComponent,
        UserRegisterComponent,
        PostComponent,
        GroupDetailComponent,
        GroupsComponent,
        AddGroupComponent,
        HomeComponent,
        NavbarComponent,
        FilesComponent,
        ProfileComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        NguiPopupModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB931vv4bgbiR3MeFMdzOIMC_RG01rCWjM',
            language: 'en'
        }),
        // GoogleMapsModule.forRoot({
        //     url: 'AIzaSyB931vv4bgbiR3MeFMdzOIMC_RG01rCWjM'
        // })
    ],
    providers: [ GroupService, PostService, UserService, UtilsService, SocketService, GoogleMapsAPIWrapper ],
    bootstrap: [AppComponent]
})
export class AppModule { }
