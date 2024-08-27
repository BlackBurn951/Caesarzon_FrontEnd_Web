import {SafeUrl} from "@angular/platform-browser";

export interface UserSearch {
  username: string;
  safeImageUrl: SafeUrl | null;
  follower: boolean;
  friend: boolean;
}
