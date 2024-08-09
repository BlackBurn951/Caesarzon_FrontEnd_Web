import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {PopupService} from "./popUpService";
import {UserSearch} from "../entities/UserSearch";
import {User} from "../entities/User";

@Injectable({
  providedIn: 'root'
})

export class FriendFollowerService {

  //Prendere gli utenti
  usersURL: string = 'http://localhost:8090/user-api/users/follower?str='


  //Prendere i follower e gli amici
  followsFriendsURL: string = 'http://localhost:8090/user-api/followers?flw='


  users !: UserSearch[]

  usersFollow !: UserSearch[]

  usersFriend !: UserSearch[]



  constructor(private popUp: PopupService, private http: HttpClient, private keyCloakService: KeyCloakService) {

  }
  takeFirst20User(){
    const headers = this.keyCloakService.permaHeader();

    const customUrl = this.usersURL+0
    this.http.get<UserSearch[]>(customUrl,  { headers, responseType: 'text' as 'json' }).subscribe(response => {
      this.users = response
    })

    const customUrl1 = this.followsFriendsURL+0+"&friend=false"
    this.http.get<UserSearch[]>(customUrl1,  { headers, responseType: 'text' as 'json' }).subscribe(response => {
      this.usersFollow = response
    })

    const customUrl2 = this.followsFriendsURL+0+"&friend=true"
    this.http.get<UserSearch[]>(customUrl2,  { headers, responseType: 'text' as 'json' }).subscribe(response => {
      this.usersFriend = response
    })

    this.popUp.openPopups(0, true)


  }


  getFollowersOrFriend() {

  }

  addFollowersOrFriends() {

  }

  deleteFollowersOrFriends() {

  }
}
