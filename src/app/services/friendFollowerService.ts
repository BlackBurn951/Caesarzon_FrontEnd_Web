import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {PopupService} from "./popUpService";
import {UserSearch} from "../entities/UserSearch";
import {User} from "../entities/User";
import {OtpDTO} from "../entities/OtpDTO";

@Injectable({
  providedIn: 'root'
})

export class FriendFollowerService {

  //Prendere gli utenti
  usersURL: string = 'http://localhost:8090/user-api/users/follower?str='


  //Prendere i follower e gli amici
  followsFriendsURL: string = 'http://localhost:8090/user-api/followers?flw='

  saveFollowURL: string = 'http://localhost:8090/user-api/followers'


  users !: UserSearch[]

  usersFollow !: UserSearch[]

  usersFriend !: UserSearch[]

  usersFriendFollowBuffer !: UserSearch[]



  constructor(private popUp: PopupService, private http: HttpClient, private keyCloakService: KeyCloakService) {
    this.users = [];
    this.usersFollow = [];
    this.usersFriend = [];
    this.usersFriendFollowBuffer = []
  }

  takeFirst20User(){
    const headers = this.keyCloakService.permaHeader();

    const customUrl = this.usersURL+0
    this.http.get<UserSearch[]>(customUrl,  { headers}).subscribe(response => {
      this.users = response
    })

    const customUrl1 = this.followsFriendsURL+0+"&friend=false"
    this.http.get<UserSearch[]>(customUrl1,  { headers }).subscribe(response => {
      this.usersFollow = response
    })

    const customUrl2 = this.followsFriendsURL+0+"&friend=true"
    this.http.get<UserSearch[]>(customUrl2,  { headers }).subscribe(response => {
      this.usersFriend = response
    })

    this.popUp.openPopups(0, true)


  }


  getFollowersOrFriend() {

  }

  addFollowersOrFriends(index: number, cerca: boolean) {
    if (cerca) {
      const selectedUser = this.users[index];
      console.log('Utente selezionato da "Cerca utenti":', selectedUser);

      this.users.splice(index, 1);
      console.log('Array users dopo la rimozione:', this.users);

      if (this.usersFollow) {
        this.usersFollow.push(selectedUser);
        console.log('Array usersFollow dopo l\'aggiunta:', this.usersFollow);
      } else {
        console.error('usersFollow è null o undefined');
      }

      if (this.usersFriendFollowBuffer) {
        this.usersFriendFollowBuffer.push(selectedUser);
        console.log('Array usersFriendFollowBuffer dopo l\'aggiunta:', this.usersFriendFollowBuffer);
      } else {
        console.error('usersFriendFollowBuffer è null o undefined');
      }
    } else {
      const selectedUser = this.usersFollow[index];
      console.log('Utente selezionato da "Seguiti":', selectedUser);

      selectedUser.friend = true;
      console.log('Flag "friend" impostato a true per l\'utente:', selectedUser);

      this.usersFollow.splice(index, 1);
      console.log('Array usersFollow dopo la rimozione:', this.usersFollow);

      if (this.usersFriend) {
        this.usersFriend.push(selectedUser);
        console.log('Array usersFriend dopo l\'aggiunta:', this.usersFriend);
      } else {
        console.error('usersFriend è null o undefined');
      }

      if (this.usersFriendFollowBuffer) {
        this.usersFriendFollowBuffer.push(selectedUser);
        console.log('Array usersFriendFollowBuffer dopo l\'aggiunta:', this.usersFriendFollowBuffer);
      } else {
        console.error('usersFriendFollowBuffer è null o undefined');
      }
    }
  }





  salvaCambiamenti() {
    const headers = this.keyCloakService.permaHeader();
    this.http.post<string>(this.saveFollowURL, this.usersFriendFollowBuffer, { headers , responseType: 'text' as 'json' })
      .subscribe(
        response => {
          this.usersFriendFollowBuffer = []
          console.log('Successo:', response);
        },
        error => {
          this.usersFriendFollowBuffer = []
          console.error('Errore:', error);
        }
      );
  }

  deleteFollowersOrFriends() {

  }
}
