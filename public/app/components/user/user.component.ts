import 'rxjs/add/operator/switchMap';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, Input, OnInit} from '@angular/core';
import { Location} from '@angular/common';

import { User } from '../../shared/user';
import { UserRes } from "../../shared/res";
import {UserService} from "../../shared/user.service";
import {UtilsService} from "../../shared/utils.service";
import {FileUploader} from "ng2-file-upload";


@Component({
  moduleId: module.id,
  selector: 'my-user',
  templateUrl: 'user.component.html'//,

})
export class UserComponent implements OnInit {

    @Input()
  curUser: User;
  inputUser: User;
  inputPassword: String;
  window: Window;

  private filesUrl = 'http://localhost:8000/add';  // URL to web api
  public uploader:FileUploader = new FileUploader({url: this.filesUrl});

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private location: Location,
              private utilsService: UtilsService
  ){
  }


  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {

    this.window = this.utilsService.nativeWindow;
  }

  register(firstName : String, lastName : String, password: String, emailName  : String): void {

    var self = this;
    this.inputUser = {
      _id: '',
      firstName: firstName,
      lastName: lastName,
      image: 'invalid',
      isAdmin: false,
      groupIds: [] as Array<String>,
        groupPendingName: [] as Array<String>,
        groupPendingUser: [] as Array<String>,
        groupWaiting:[] as Array<String>,
        email: emailName,
      //password: password,
      likes: [] as Array<String>,
      dislikes: [] as Array<String>
    };
    this.inputPassword = password;
    this.userService.register(this.inputUser, this.inputPassword)
        .then(function (userRes: UserRes) {
          if(userRes.res.tag == 'user authenticated' || userRes.res.tag == 'logged in')
          {
            self.curUser = userRes.user;
          }
          else if(userRes.res.tag == 'login')
          {
            self.userService.login(userRes.user.email, self.inputPassword)
                .then(function(uRes){
                  console.log(uRes.res.message);
                  self.curUser = uRes.user;
                  self.window.location.href = "http://localhost:3000/";
                });
          }
        });

  }


  getCurUser(): void{
    var self = this;
    this.userService.getCurUser()
        .then(function(user){
          self.curUser = user;
        });
  }

  logout(): void{
    var self = this;
    this.userService.logout()
        .then(function(uRes){
          console.log(uRes.res.message);
          self.curUser = uRes.user;
        });
  }


  login(email:String, pass: String): void{
    var self = this;
    console.log(pass);
      this.userService.login(email,pass)
        .then(function(uRes){
          console.log(uRes.res.message);
          self.curUser = uRes.user;
          self.window.location.href = "http://localhost:3000/";
        });
  }

    log(): void{
        var self = this;
        this.userService.login("Elhananxxx@gmail.com", "tkjbi123")
            .then(function(uRes){
                console.log(uRes.res.message);
                self.curUser = uRes.user;
                self.window.location.href = "http://localhost:3000/";
            });
    }
}

