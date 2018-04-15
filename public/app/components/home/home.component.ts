import {Component, OnInit, ViewChild} from '@angular/core';
import { UtilsService } from '../../shared/utils.service';
import { UserService } from '../../shared/user.service';
import {User} from "../../shared/user";
import * as io from 'socket.io-client';
import {NguiMessagePopupComponent, NguiPopupComponent} from "@ngui/popup";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';


@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit{

    curUser: User;
    window: Window;

    socket: SocketIOClient.Socket;
    branding = "TripLand App";

    @ViewChild(NguiPopupComponent) popup: NguiPopupComponent;



    constructor(private userService: UserService,
                private utilsService: UtilsService){
        this.window = utilsService.nativeWindow;
        this.socket = io.connect('http://localhost:8000');
    }

    ngOnInit(): void{




        var self= this;
        this.userService.getCurUser()
            .then(function(user){
                if(user)
                {
                    self.curUser = user;
                }
            });
    }



}
