import { Comment } from './comment';
import {User} from "./user";

export class Post{
  _id: String;
  title: String;
  text: String;
  image: String;
  groupId: String;
  userId: User;
  comments: Comment[];
  likes: number;
  dislikes: number;
  connectedUserFlag: boolean;
  linkUrl: String;
  dateCreated: Date;
}
