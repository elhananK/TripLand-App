import {Component, OnInit} from '@angular/core';
import {User} from "../../shared/user";
import {UserService} from "../../shared/user.service";
import {UtilsService} from "../../shared/utils.service";
import {Notify} from "../../shared/notify";
import {SocketService} from '../../shared/socket.service';

import * as io from 'socket.io-client';
import 'rxjs/Rx';
import {Group} from "../../shared/group";
import {Router} from "@angular/router";
import {GroupService} from "../../shared/group.service";

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent implements OnInit{
    curUser: User;
    groups:Group [];
    window: Window;
    socket: SocketIOClient.Socket;
    branding = "TripLand App";
    notifyArray: Notify [] = [];

    constructor(private userService: UserService,
                private groupService: GroupService,
                private utilsService: UtilsService,
                private socketService:SocketService,
                private router: Router){
        this.window = utilsService.nativeWindow;
        this.socket = io.connect('http://localhost:8000');
    }

    ngOnInit(): void {
        var self= this;
        if(!self.curUser) {
            this.userService.getCurUser()
                .then(function (user) {
                    if (user) {
                        self.curUser = user;
                        self.socket.emit('eventGetNotify', user);
                        self.socket.emit('eventNotify');
                        self.socket.emit('eventClear');
                        console.log(self.notifyArray);
                        if(user.groupIds.length > 0)
                        self.socketService.setRooms(user.groupIds);
                        self.groupService.getGroups().then(groups => {
                            self.socketService.setRoomsForAdminSub(groups,user._id);
                        });
                    }
                });
        }


        self.socket.on('eventNotify',function(data) {
            console.log('enter to eventNotify');
            console.log(data);
            self.notifyArray = data;
        });

        this.socketService.NewNotifySubject.subscribe(data => {
          self.notifyArray = data;
        });

        this.socketService.NewNotifyLoggedInUsers.subscribe(data => {
            console.log(data);
            self.notifyArray.push(data);
        });
    }

    notifyApprove(approve: Notify): void {
        var self = this;
         this.socket.emit('eventApproveUser', self.curUser._id,approve.userId, approve.groupId);
         var index = this.notifyArray.indexOf(approve);
        this.notifyArray.splice(index, 1);
            this.socketService.updateUserPending(self.curUser,approve.groupName);
    }

    GoToPost(approve: Notify): void {
        var self = this;
        console.log(approve);
        self.router.navigate(['/posts', approve.url]);
        var index = this.notifyArray.indexOf(approve);
        this.notifyArray.splice(index, 1);

    }

    groupOk(approve: Notify): void {
        var self = this;
        var index = this.notifyArray.indexOf(approve);
        this.notifyArray.splice(index, 1);
        this.userService.getCurUser().then(user => {
             self.socketService.updateGroup(user);
             self.socketService.setRooms(user.groupIds);
        });

    }


    logout(): void{
        var self = this;
        this.userService.logout()
            .then(function(uRes){
                self.curUser = uRes.user;
                self.window.alert(uRes.res.message);
                self.window.location.href = "http://localhost:3000/";
            });
    }
}
