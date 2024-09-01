import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {PopupService} from "./popUpService";
import {UserSearch} from "../entities/UserSearch";

import {DomSanitizer} from "@angular/platform-browser";

import {AdminService} from "./adminService";

@Injectable({
  providedIn: 'root'
})

export class FriendFollowerService {

  //Prendere gli utenti
  usersURL: string = 'http://localhost:8090/user-api/users/follower?str='


  //Prendere i follower e gli amici
  followsFriendsURL: string = 'http://localhost:8090/user-api/followers?flw='

  saveFollowURL: string = 'http://localhost:8090/user-api/followers'


  users: UserSearch[] = []

  usersFollow : UserSearch[] = []

  usersFriend : UserSearch[] = []

  usersFriendFollowBuffer : UserSearch[] =[]

  pagineAmici: number = 0


  constructor(private adminService: AdminService, private sanitizer: DomSanitizer, private popUp: PopupService, private http: HttpClient, private keyCloakService: KeyCloakService) {
    this.users = [];
    this.usersFollow = [];
    this.usersFriend = [];
    this.usersFriendFollowBuffer = []
  }

  takeFirst20User(caricaAltro: boolean) {
    if(caricaAltro){
      this.pagineAmici += 1
    }
    const headers = this.keyCloakService.permaHeader();
    const customUrl = this.usersURL + this.pagineAmici;
    this.http.get<UserSearch[]>(customUrl, { headers }).subscribe(response => {
      if (response) {
        if (response.length > 0) {
          response.forEach(user => {
            if (user && !this.users.some(existingUser => existingUser.username === user.username)) {
              this.users.push(user);
            }
          });
        }
          this.users.forEach(user =>{
            this.adminService.getUserProfilePic(user.username).subscribe(
              response => {
                const url = URL.createObjectURL(response);
                user.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
              },
              error => {
                console.error('Errore nel caricamento dell\'immagine', error);
              }
            );
          })

      } else {
        console.error('La risposta per gli utenti è null o undefined');
        this.users = []; // Imposta un array vuoto o gestisci l'errore come necessario
      }
    });

    const customUrl1 = this.followsFriendsURL + this.pagineAmici + "&friend=false";
    this.http.get<UserSearch[]>(customUrl1, { headers }).subscribe(response => {
      if (response) {
        if (response.length > 0) {
          response.forEach(user => {
            if (user && !this.usersFollow.some(existingUser => existingUser.username === user.username)) {
              this.usersFollow.push(user);
            }
          });
        }
        this.usersFollow.forEach(user =>{
          this.adminService.getUserProfilePic(user.username).subscribe(
            response => {
              const url = URL.createObjectURL(response);
              user.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
            },
            error => {
              console.error('Errore nel caricamento dell\'immagine', error);
            }
          );
        })
      } else {
        console.error('La risposta per usersFollow è null o undefined');
        this.usersFollow = [];
      }
    });

    const customUrl2 = this.followsFriendsURL + this.pagineAmici + "&friend=true";
    this.http.get<UserSearch[]>(customUrl2, { headers }).subscribe(response => {
      if (response) {
        if (response.length > 0) {
          response.forEach(user => {
            if (user && !this.usersFriend.some(existingUser => existingUser.username === user.username)) {
              this.usersFollow.push(user);
            }
          });
        }
        this.usersFriend.forEach(user =>{
          this.adminService.getUserProfilePic(user.username).subscribe(
            response => {
              const url = URL.createObjectURL(response);
              user.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
            },
            error => {
              console.error('Errore nel caricamento dell\'immagine', error);
            }
          );
        })
      } else {
        console.error('La risposta per usersFriend è null o undefined');
        this.usersFriend = [];
      }
    });

    this.popUp.openPopups(0, true);


  }





  addFollowersOrFriends(index: number, cerca: boolean) {
    if (cerca) {
      const selectedUser = this.users[index];


      if (!this.usersFollow) {
        this.usersFollow = [];
      }
      this.usersFollow.push(selectedUser);

      if (!this.usersFriendFollowBuffer) {
        this.usersFriendFollowBuffer = [];
      }
      this.usersFriendFollowBuffer.push(selectedUser);
    } else {
      const selectedUser = this.usersFollow[index];

      if (selectedUser) {
        selectedUser.friend = true;


        if (!this.usersFriend) {
          this.usersFriend = [];
        }
        this.usersFriend.push(selectedUser);

        if (!this.usersFriendFollowBuffer) {
          this.usersFriendFollowBuffer = [];
        }
        this.usersFriendFollowBuffer.push(selectedUser);
      } else {
      }
    }
  }


  salvaCambiamenti() {
    const headers = this.keyCloakService.permaHeader();
    if(this.usersFriendFollowBuffer.length > 0){
      this.http.post<string>(this.saveFollowURL, this.usersFriendFollowBuffer, { headers , responseType: 'text' as 'json' })
        .subscribe(
          response => {
            this.usersFriendFollowBuffer = []
          },
          error => {
            this.usersFriendFollowBuffer = []
          }
        );
    }
  }

  deleteFollowers(username: string) {
    // Trova l'indice dell'utente basato sullo username
    const userIndex = this.usersFollow.findIndex(user => user.username === username);

    // Controlla se l'utente esiste
    if (userIndex !== -1) {
      // Rimuovi l'utente da usersFollow e usersFriend
      this.usersFollow.splice(userIndex, 1);
      this.usersFriend.splice(userIndex, 1);

      // Crea l'URL personalizzato
      const customUrl = this.saveFollowURL + "/" + username;

      // Prepara gli header
      const headers = this.keyCloakService.permaHeader();

      // Effettua la richiesta DELETE
      this.http.delete<string>(customUrl, { headers, responseType: 'text' as 'json' }).subscribe(response => {
      });
    } else {
    }
  }


  deleteFriends(index: number){
    const selectedUser = this.usersFriend[index];
    selectedUser.friend = false;
    this.usersFriendFollowBuffer.push(selectedUser);
    this.usersFriend.splice(index, 1);
    const headers = this.keyCloakService.permaHeader();
    this.http.post<string>(this.saveFollowURL, this.usersFriendFollowBuffer, { headers , responseType: 'text' as 'json' })
      .subscribe(
        response => {
          this.usersFriendFollowBuffer = []
        },
        error => {
          this.usersFriendFollowBuffer = []
        }
      );
  }
}
