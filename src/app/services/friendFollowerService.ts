import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {PopupService} from "./popUpService";
import {UserSearch} from "../entities/UserSearch";

import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {User} from "../entities/User";
import {UserService} from "./userService";
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


  imageUrl!: SafeUrl | null

  constructor(private adminService: AdminService, private userService: UserService, private sanitizer: DomSanitizer, private popUp: PopupService, private http: HttpClient, private keyCloakService: KeyCloakService) {
    this.users = [];
    this.usersFollow = [];
    this.usersFriend = [];
    this.usersFriendFollowBuffer = []
  }

  takeFirst20User() {
    const headers = this.keyCloakService.permaHeader();

    const customUrl = this.usersURL + 0;
    this.http.get<UserSearch[]>(customUrl, { headers }).subscribe(response => {
      if (response) { // Controlla se la risposta non è null o undefined
          this.users = response
          this.users.forEach(user =>{
            this.adminService.getUserProfilePic(user.username).subscribe(
              response => {
                const url = URL.createObjectURL(response);
                user.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
                console.log("IMMAGINE CONVERTITA E FUNZIONANTE AIDIFRATELLO: " + this.imageUrl)

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

    const customUrl1 = this.followsFriendsURL + 0 + "&friend=false";
    this.http.get<UserSearch[]>(customUrl1, { headers }).subscribe(response => {
      if (response) {
        this.usersFollow = response
        this.usersFollow.forEach(user =>{
          this.adminService.getUserProfilePic(user.username).subscribe(
            response => {
              const url = URL.createObjectURL(response);
              user.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
              console.log("IMMAGINE CONVERTITA E FUNZIONANTE AIDIFRATELLO: " + this.imageUrl)

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

    const customUrl2 = this.followsFriendsURL + 0 + "&friend=true";
    this.http.get<UserSearch[]>(customUrl2, { headers }).subscribe(response => {
      if (response) {
        this.usersFriend = response
        this.usersFriend.forEach(user =>{
          this.adminService.getUserProfilePic(user.username).subscribe(
            response => {
              const url = URL.createObjectURL(response);
              user.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
              console.log("IMMAGINE CONVERTITA E FUNZIONANTE AIDIFRATELLO: " + this.imageUrl)

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
      console.log('Utente selezionato da "Cerca utenti":', selectedUser);

      console.log('Array users dopo la rimozione:', this.users);

      if (!this.usersFollow) {
        this.usersFollow = [];
      }
      this.usersFollow.push(selectedUser);
      console.log('Array usersFollow dopo l\'aggiunta:', this.usersFollow);

      if (!this.usersFriendFollowBuffer) {
        this.usersFriendFollowBuffer = [];
      }
      this.usersFriendFollowBuffer.push(selectedUser);
      console.log('Array usersFriendFollowBuffer dopo l\'aggiunta:', this.usersFriendFollowBuffer);
    } else {
      const selectedUser = this.usersFollow[index];
      console.log('Utente selezionato da "Seguiti":', selectedUser);

      if (selectedUser) {
        selectedUser.friend = true;
        console.log('Flag "friend" impostato a true per l\'utente:', selectedUser);

        console.log('Array usersFollow dopo la rimozione:', this.usersFollow);

        if (!this.usersFriend) {
          this.usersFriend = [];
        }
        this.usersFriend.push(selectedUser);
        console.log('Array usersFriend dopo l\'aggiunta:', this.usersFriend);

        if (!this.usersFriendFollowBuffer) {
          this.usersFriendFollowBuffer = [];
        }
        this.usersFriendFollowBuffer.push(selectedUser);
        console.log('Array usersFriendFollowBuffer dopo l\'aggiunta:', this.usersFriendFollowBuffer);
      } else {
        console.error('Utente selezionato non trovato in usersFollow');
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
            console.log('Successo:', response);
          },
          error => {
            this.usersFriendFollowBuffer = []
            console.error('Errore:', error);
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
        console.log(response);
      });
    } else {
      console.log("Utente non trovato");
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
          console.log('Successo:', response);
        },
        error => {
          this.usersFriendFollowBuffer = []
          console.error('Errore:', error);
        }
      );
  }
}
