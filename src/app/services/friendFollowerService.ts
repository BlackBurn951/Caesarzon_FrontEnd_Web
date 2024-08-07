import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {PopupService} from "./popUpService";

@Injectable({
  providedIn: 'root'
})

export class FriendFollowerService {

  followersOrFriendsURL: string = 'http://localhost:8090/followers'


  constructor(private popUp: PopupService, private http: HttpClient, private keyCloakService: KeyCloakService) {

  }

  getFollowersOrFriend() {

  }

  addFollowersOrFriends() {

  }

  deleteFollowersOrFriends() {

  }
}
