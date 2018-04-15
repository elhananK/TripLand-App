import 'rxjs/add/operator/switchMap';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, Input, OnInit} from '@angular/core';
import { Location} from '@angular/common';

import { Post } from '../../shared/post';
import { Group } from "../../shared/group";
import { Comment } from '../../shared/comment';
import { GroupService } from '../../shared/group.service';
import { PostService } from '../../shared/post.service';


@Component({
  moduleId: module.id,
  selector: 'my-post',
  templateUrl: 'post.component.html',
  styleUrls: [ './css/4-col-portfolio.css', './css/bootstrap.min.css', './css/thumbnail-gallery.css']

})
export class PostComponent implements OnInit{

  @Input()
  post: Post;
  group: Group;
  comments: Comment[];

  constructor(private groupService: GroupService,
              private postService: PostService,
              private route: ActivatedRoute,
              private location: Location
  ){}


  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {

    var self = this;
    this.route.params
      .switchMap((params: Params) => this.postService.getPost(params['id']))
      .subscribe(function(post){
        console.log(post);
        self.post = post;
        self.comments = post.comments;
      });
  }

  addComment(text: String): void {
    var self = this;
    if (!text) { return; }
    this.postService.createComment(text, this.post._id)
      .then(function(post){
            self.post = post;
            self.comments = post.comments;
          });
  }
}


