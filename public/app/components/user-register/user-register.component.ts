import 'rxjs/add/operator/switchMap';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, Input, OnInit} from '@angular/core';
import { Location} from '@angular/common';
import { Headers } from '@angular/http';


import { User } from '../../shared/user';
import { UserRes } from "../../shared/res";
import {UserService} from "../../shared/user.service";
import {UtilsService} from "../../shared/utils.service";
import {FileUploader} from "ng2-file-upload";


@Component({
  moduleId: module.id,
  selector: 'my-user',
  templateUrl: 'user-register.component.html'//,
  // styleUrls: [ './css/4-col-portfolio.css', './css/bootstrap.min.css', './css/thumbnail-gallery.css']

})
export class UserRegisterComponent implements OnInit{

  @Input()
  curUser: User;
  inputUser: User;
  inputPassword: String;
  window: Window;

  private headers = new Headers({'Content-Type': 'application/json'});
  private filesUrl = 'http://localhost:8000/add';  // URL to web api
  public uploader:FileUploader = new FileUploader({url: this.filesUrl});

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private location: Location,
              private utilsService: UtilsService
  ){}


  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {

    this.window = this.utilsService.nativeWindow;
    this.inputUser = {
      _id: '',
      firstName: 'Elhanan',
      lastName: 'Kalfa',
      image: 'invalid',
      isAdmin: false,
      groupIds: [] as Array<String>,
        groupPendingName: [] as Array<String>,
        groupPendingUser: [] as Array<String>,
        groupWaiting:[] as Array<String>,
        email: 'elhanan@gmail.com',
      //password: '1234',
      likes: [] as Array<String>,
      dislikes: [] as Array<String>
    };
    this.inputPassword = 'tkjbi';

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

    console.log(this.inputUser);
    console.log(this.inputPassword);

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
          console.log(self.curUser);
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

  // login(email:String, pass: String): void{
  //   var self = this;
  //   console.log(email + " " + pass);
  //   this.userService.login(email, pass)
  //       .then(function(uRes){
  //         console.log(uRes.res.message);
  //         self.curUser = uRes.user;
  //         self.window.location.href = "http://localhost:3000/"
  //       });


  login(email:String, pass: String): void{
    var self = this;
  console.log(this.inputUser.email + " " + this.inputPassword);
      this.userService.login(this.inputUser.email, this.inputPassword)
        .then(function(uRes){
          console.log(uRes.res.message);
          self.curUser = uRes.user;
          self.window.location.href = "http://localhost:3000/";
        });
  }
}

