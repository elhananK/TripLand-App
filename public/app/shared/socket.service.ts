import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { User } from '../shared/user';
import { Notify } from "./notify";
import  { Subject } from 'rxjs/Subject';
import { Group } from "./group";


@Injectable()
export class SocketService {
    socket: SocketIOClient.Socket;
    curUser: User;
    notifyArray: Notify [] = [];
    public NewGroupSubject = new Subject<any>();
    public NewNotifySubject = new Subject<any>();
    public NewNotifyLoggedInUsers = new Subject<any>();



    constructor(){
        this.socket = io.connect('http://localhost:8000');
        var self = this;
        self.socket.on('eventNotify',function(data) {
            self.notifyArray = data;
            self.NewNotifySubject.next(self.notifyArray);
        });

        self.socket.on('sentNotifyAfterSubscribe' , function (data) {
            self.NewNotifyLoggedInUsers.next(data);
        });
        self.socket.on('sentApproveAfterSubscribe' , function (data) {
            self.NewNotifyLoggedInUsers.next(data);
        });

        self.socket.on('sentPostToConnectedUsersOnly' , function (data) {
            self.NewNotifyLoggedInUsers.next(data);
        });
    }

    setNotification(user: User){
        var self = this;
        self.socket.emit('eventGetNotify', user);
        self.socket.emit('eventNotify');
        self.socket.emit('eventClear');
     }

    notifyPostToLoggedUsers( groupId: String, url:String, userId: String ){
        var self = this;
        console.log(url);
        self.socket.emit('broadcastPost',groupId,url,userId);
    }

    setRooms( groupIds ){

        this.socket.emit('joinRooms',groupIds);
    }

    updateUserPending( approveUser, groupName ){

        this.socket.emit('broadcastPending',approveUser, groupName);
    }

    setRoomsForAdminSub( groupsAdmin : Group [], userId ){

        for (var i = 0, len = groupsAdmin.length; i < len; i++) {

            if(groupsAdmin[i].adminId == userId){
                this.socket.emit('joinRoomsForGroupAdmin', groupsAdmin[i].title );
            }
        }
    }

    broadcastSubscribe( curUser: User, group : Group){

        this.socket.emit('broadcastSubscribe', curUser , group);
    }

    updateGroup(data): void{
        this.NewGroupSubject.next(data);
     }

}
