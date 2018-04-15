import 'rxjs/add/operator/toPromise';
import { Post } from './post';
import { Injectable, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import {User} from "./user";
import {PostRes} from "./res";
import {Likes} from "./likes";


@Injectable()
export class PostService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private groupsUrl = 'http://localhost:8000/groups';  // URL to web api
  private postsUrl = 'http://localhost:8000/posts';  // URL to web api

  constructor(private http: Http) {
  }

  getPosts(): Promise<Post[]> {
    return this.http.get(this.groupsUrl, {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as Post[])
      .catch(this.handleError);
  }

  getPostByCurUser(id: String): Promise<Post[]> {

    return this.http.get(this.groupsUrl + '/getPostByCurUser/' + id, {headers: this.headers, withCredentials: true})
        .toPromise()
        .then(response => response.json() as Post[])
        .catch(this.handleError);
  }

  getPostsByGroupId(groupId: String): Promise<Post[]> {
    return this.http.get(this.groupsUrl + '/' + groupId, {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as Post[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getPost(id: String): Promise<Post> {
    return this.http.get(this.postsUrl + '/' + id, {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as Post)
      .catch(this.handleError);
  }


  create(textPost: String, textTitle: String, textUrl:String,  groupId: String): Promise<Post> {
    return this.http
      .post(this.postsUrl , JSON.stringify({textPost: textPost, textTitle:textTitle,textUrl:textUrl, groupId:groupId}), {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(res => res.json() as Post)
      .catch(this.handleError);
  }

  createLoggedInUsers(textPost: String, textTitle: String, textUrl:String,  groupId: String): Promise<Post> {
    return this.http
        .post(this.postsUrl + '/loggedInUsers' , JSON.stringify({textPost: textPost, textTitle:textTitle, textUrl:textUrl, groupId:groupId}), {headers: this.headers, withCredentials: true})
        .toPromise()
        .then(res => res.json() as Post)
        .catch(this.handleError);
  }

  createComment(text: String, postId: String): Promise<Post>{
    console.log(text);
    return this.http
      .post(this.postsUrl + '/' + postId + '/comment', JSON.stringify({text: text}), {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  updateLikes(op: String, postId: String,userId: String): Promise<PostRes>{
    return this.http
      .post(this.postsUrl + '/' +postId + '/likes', JSON.stringify({op: op,userId:userId}), {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as PostRes)
      .catch(this.handleError);
  }

  countLikesAndDislikes(userId: String, userImage: String): Promise<Likes>{
    return this.http
        .post(this.postsUrl + '/countLikes', JSON.stringify({userId: userId,userImage: userImage}), {headers: this.headers, withCredentials: true})
        .toPromise()
        .then(response => response.json() as Likes)
        .catch(this.handleError);
  }
}
