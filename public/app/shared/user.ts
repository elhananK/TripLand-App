export class User{
  _id: String;
  firstName: String;
  lastName: String;
  image: String;
  isAdmin: boolean;
  groupIds: Array<String>;
  groupPendingName: Array<String>;
  groupPendingUser: Array<String>;
  groupWaiting: Array<String>;
  email: String;
  //password: String;
  likes: Array<String>;
  dislikes: Array<String>;
};