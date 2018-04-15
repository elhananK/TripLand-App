import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';


import 'rxjs/add/operator/toPromise';
import { Group } from './group';
import {User} from "./user";
import {GroupRes} from "./res";
import {Subject} from "rxjs/Subject";

@Injectable()
export class GroupService {


  private headers = new Headers({'Content-Type': 'application/json'});
  private groupsUrl = 'http://localhost:8000/groups';  // URL to web api
  public NewGroupSubject = new Subject<any>();


  constructor(private http: Http
  ){}


  getGroups(): Promise<Group[]> {
    return this.http.get(this.groupsUrl, {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response =>  response.json() as Group[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getGroup(id: String): Promise<Group>{
    return this.getGroups().then(groups =>
      groups.find(group => group._id === id)
    );
  }
  createGroup(text: String, img:String): Promise<GroupRes> {
    return this.http
        .post(this.groupsUrl, JSON.stringify({text: text,img:img}), {headers: this.headers, withCredentials: true})
        .toPromise()
        .then(response => response.json() as GroupRes)
        .catch(this.handleError);
  }
  subscribe(groupId: String,groupAdmin, user:User): Promise<GroupRes> {
    return this.http
        .post(this.groupsUrl + "/subscribe", JSON.stringify({groupId: groupId ,groupAdmin: groupAdmin, user:user}), {headers: this.headers, withCredentials: true})
        .toPromise()
        .then(response => response.json() as GroupRes)
        .catch(this.handleError);
  }
}
