import {Component, EventEmitter, OnChanges, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router'
import 'rxjs/add/operator/toPromise';
import  { Group } from '../../shared/group';
import { GroupService} from "../../shared/group.service";
import {UserService} from "../../shared/user.service";
import {User} from "../../shared/user";
import { NavbarComponent } from '../navbar/navbar.component';
import {SocketService} from '../../shared/socket.service';
import {Notify} from "../../shared/notify";

@Component({
  moduleId: module.id,
  selector: 'groups',
  templateUrl: 'groups.component.html',
  providers: [ GroupService ],
  styleUrls: [ './css/4-col-portfolio.css', './css/bootstrap.min.css', './css/thumbnail-gallery.css'],
})
export class GroupsComponent implements OnInit{

  groups: Group[];
  selectedGroup: Group;
  curUser: User;
  window:Window;
  notify:NavbarComponent;
  notifyArray: Notify [] = [];
  @Output() someCustomEvent = new EventEmitter<Number>();

  constructor(private router: Router,
              private groupService: GroupService,
              private userService: UserService,
              private socketService:SocketService){}

  ngOnInit(): void{

    var self = this;

    this.userService.getCurUser()
        .then(function(user){
          self.curUser = user;
        });

    this.getGroups();
    this.socketService.NewGroupSubject.subscribe(data => {
      self.curUser = data;
      //self.socketService.setRooms(self.curUser.groupIds);
    });

  }
  getGroups(): void {
    this.groupService.getGroups().then(groups => {
      this.groups = groups;
    });

  }

  subscribe(group : Group): void {
    var selfe = this;
    if(!group._id){return;}
    this.groupService.subscribe(group._id,group.adminId,selfe.curUser)
        .then(groupRes => {
          this.ngOnInit();
          self.window.alert(groupRes.res.message);
          selfe.noti(group);
        });

  }
  noti(groupAdmin : Group):void {

    var self = this;
      this.socketService.broadcastSubscribe(self.curUser,groupAdmin);

  }


  gotoGroupDetail(group: Group): void {
    var selfe = this;
    selfe.selectedGroup = group;
    if(selfe.curUser.groupIds.indexOf(selfe.selectedGroup._id) > -1)
    selfe.router.navigate(['/groups', selfe.selectedGroup._id]);
    else
      self.window.alert("You Are Not Member Of " + selfe.selectedGroup.title + " Group");

  }

  gotoAddGroup(): void {
    this.router.navigate(['/add-group']);
  }
}

