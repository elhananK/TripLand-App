import 'rxjs/add/operator/switchMap';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';


import { Post } from '../../shared/post';
import { Group } from "../../shared/Group";
import { GroupService } from '../../shared/group.service';
import { PostService } from '../../shared/post.service';
import { FileUploader } from "ng2-file-upload";
import { SocketService } from "../../shared/socket.service";
import { UserService } from "../../shared/user.service";
import { User } from "../../shared/user";

@Component({
  moduleId: module.id,
  selector: 'my-group-detail',
  templateUrl: 'group-detail.component.html',

})
export class GroupDetailComponent implements OnInit{

    curUser:User;
    @Input()
    group: Group;
    posts: Post[];
    selectedPost: Post;
    checkBoxValue: boolean = false;
    window:Window;

    private filesUrl = 'http://localhost:8000/posts/add';  // URL to web api
    public uploader:FileUploader = new FileUploader({url: this.filesUrl});

  constructor(private groupService: GroupService,
              private postService: PostService,
              private route: ActivatedRoute,
              private location: Location,
              private router: Router,
              private socketService: SocketService,
              private userService: UserService){}

  getPostsByGroupId(): void {
      var self = this;
    this.postService.getPostsByGroupId(this.group._id).then(posts => {
        this.posts = posts;
        console.log(self.posts);

    });
  }

  getPosts(): void {
      var self = this;
    this.postService.getPosts().then(posts => {
        this.posts = posts;
        console.log(self.posts);

    });
  }

  goBack(): void {
    this.location.back();
  }

  gotoPostDetail(post: Post): void {
    this.selectedPost = post;
    this.router.navigate(['/posts', this.selectedPost._id]);
  }

  ngOnInit(): void {
    var self = this;
    this.route.params
      .switchMap((params: Params) => this.groupService.getGroup(params['id']))
      .subscribe(function(group){
        self.group = group;
        self.getPostsByGroupId();
      });
    this.userService.getCurUser().then(user => {
       self.curUser = user;
    });
  }

  add(textPost: String, textTitle:String, textUrl:String): void {

      var self = this;
      console.log(textUrl);
      if(this.checkBoxValue == false) {
          if (!textPost) {
              return;
          }
          if(textUrl) {
              console.log(textUrl);
              this.postService.create(textPost, textTitle, textUrl, this.group._id)
                  .then(post => {
                      this.posts.push(post
                      );
                  });
          }else{
              textUrl = ' ';
              this.postService.create(textPost, textTitle, textUrl, this.group._id)
                  .then(post => {
                      this.posts.push(post
                      );
                  });
          }
      }else if(this.checkBoxValue == true){

          if (!textPost) {
              return;
          }
          console.log(this.checkBoxValue);
          if(textUrl) {
              console.log(textUrl);
              this.postService.createLoggedInUsers(textPost, textTitle, textUrl, this.group._id)
                  .then(post => {
                      self.socketService.notifyPostToLoggedUsers(post.groupId, post._id, post.userId._id);
                  });
          }else{
              textUrl = ' ';
              this.postService.createLoggedInUsers(textPost, textTitle, textUrl, this.group._id)
                  .then(post => {
                      self.socketService.notifyPostToLoggedUsers(post.groupId, post._id, post.userId._id);
                  });
          }
      }
  }

  Like(postId: String): void {
    var post = this.posts.find(post => post._id == postId);
    var myPostIndex = this.posts.findIndex(myPost => myPost == post);
    var selfe = this;
    this.postService.updateLikes("pluslikeminusdislike", postId,selfe.curUser._id)
        .then(postRes =>
                {
                    if (postRes.post)
                    {
                        console.log("hi i made it to postRes.post")
                        selfe.posts[myPostIndex] = postRes.post;

                    }
                 else if(postRes.res)
                     self.window.alert(postRes.res.message);
                });
  }

  Dislike(postId: String): void {
    var post = this.posts.find(post => post._id == postId);
    var myPostIndex = this.posts.findIndex(myPost => myPost == post);
    var selfe = this;
    this.postService.updateLikes("minuslikeplusdislike", postId, selfe.curUser._id)
        .then(
            postRes => {
                {
                    if (postRes.post)
                        selfe.posts[myPostIndex] = postRes.post;
                    else if (postRes.res)
                        self.window.alert(postRes.res.message);
                }
                });
  }

}

