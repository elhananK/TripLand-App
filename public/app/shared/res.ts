import { User } from './user';
import {Post} from "./post";
import {Group} from "./group";

export class Res{
  message: String;
  tag: String;
};

export class UserRes{
  res: Res;
  user: User;
};

export class PostRes{
  res: Res;
  post: Post;
};

export class GroupRes{
  res: Res;
  group:Group;
}

