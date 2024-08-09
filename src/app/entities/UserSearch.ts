//DTO relativo ai dati di un utente (LATO USER)

import {SafeUrl} from "@angular/platform-browser";

export interface UserSearch{
  username: string;
  safeImageUrl:  number[]
  follower: boolean
  friend: boolean

}
