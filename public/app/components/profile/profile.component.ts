import {Component, OnInit} from '@angular/core';
import {UserService} from "../../shared/user.service";
import {User} from "../../shared/user";
import {PostService} from "../../shared/post.service";
import {Likes} from "../../shared/likes";
import {Post} from "../../shared/post";


@Component({
    moduleId: module.id,
    selector: 'profile',
    templateUrl: 'profile.component.html',
})

export class ProfileComponent implements OnInit{

    curUser: User;
    likesCounter: Likes;
    posts: Post [];

    constructor(private userService:UserService,
                private postService:PostService){

    }

    ngOnInit(): void {
        var self = this;
        this.userService.getCurUser().then(user =>{
           self.curUser = user;
           console.log(user);
           self.postService.getPostByCurUser(user._id).then(posts => self.posts = posts);
           self.postService.countLikesAndDislikes(self.curUser._id,self.curUser.image).then(likes => {
               console.log(likes);
               self.likesCounter = likes;
           });
        });
    }


}