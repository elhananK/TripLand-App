import 'rxjs/add/operator/toPromise';
import { User } from './user';
import { UserRes } from './res';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private usersUrl = 'http://localhost:8000/users';  // URL to web api
  private indexUrl = 'http://localhost:8000';  // URL to web api


  constructor(private http: Http) {
  }

    getCurUser(): Promise<User>{
    return this.http.get(this.usersUrl + '/cur_user', {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json().user as User)
      .catch(this.handleError);

    }

  getUserById(id: String): Promise<User>{
  return this.http.get(this.usersUrl)
    .toPromise()
    .then(response => response.json() as User)
    .catch(this.handleError);
  }

  register(user: User, password: String): Promise<UserRes>{
    return this.http.post(this.indexUrl + '/register', JSON.stringify({user: user, password: password}), {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as UserRes)
      .catch(this.handleError);
  }

  login(email: String, password: String): Promise<UserRes>{
    return this.http.post(this.indexUrl + '/login', JSON.stringify({username: email, password: password}), {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as UserRes)
      .catch(this.handleError);
  }

  logout(): Promise<UserRes>{
    return this.http.get(this.indexUrl + '/logout', {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as UserRes)
      .catch(this.handleError);
  }

  updateUser(user: User, password: String): Promise<UserRes>{
    return this.http.post(this.usersUrl + '/update_user/' + user.email, JSON.stringify({user: user, password: password}), {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as UserRes)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


}


