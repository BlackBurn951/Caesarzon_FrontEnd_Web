import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {PopupService} from "./popUpService";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {



  private accessTokenUrl = 'http://25.24.244.170:8080/realms/CaesarRealm/protocol/openid-connect/token';

  private ACCESS_TOKEN!: string;
  private REFRESH_TOKEN!: string;

  private isAdmin: boolean = true

  private isLogged = false;

  constructor(private http: HttpClient, private popUp: PopupService) { }

  //Pulizia delle variabili relative ai token dell'utente
  refreshAuthVariables(){
    this.ACCESS_TOKEN = "";
    this.REFRESH_TOKEN = "";
  }

  //Metodo per ricevere i token da KeyCloak per l'utente
  login(username: string, password: string): void{
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'caesar-app');
    body.set('username', username);
    body.set('password', password);

    this.http.post(this.accessTokenUrl, body.toString(), { headers, withCredentials: true }).subscribe(
      (response:any) => {
        this.setTokens(response.access_token, response.refresh_token);
        if(username != "guest"){
          this.isLogged = true;
          this.setLogin();
          this.popUp.closePopup()
        }
        console.log("TOKEN: " + this.ACCESS_TOKEN);

      },
      (error) => {
        console.error("Error during request:", error);
      }
    );

  }

  getIsAdmin(){
    return this.isAdmin;
  }


  //Metodo per assegnare i token alla cache
  setTokens(accessToken: string, refreshToken: string) {
    this.ACCESS_TOKEN = accessToken;
    this.REFRESH_TOKEN = refreshToken;
    localStorage.setItem('access_token', accessToken);
  }

  setLogin(){
    localStorage.setItem('isLogged', String(this.isLogged));
  }

  //Metodo per prendere i token dalla cache
  getAccessToken() {
    const token = localStorage.getItem('access_token');
    console.log("TOKEN NELLA CACHE: " + token)
    if (token) {
      return token;
    } else {
      return this.ACCESS_TOKEN;
    }
  }

  //Metodo per prendere lo stato di logging dell'utente
  getLoggedStatus(){
    const isLoggedString = localStorage.getItem('isLogged');
    if (isLoggedString) {
      return isLoggedString === 'true';
    } else {
      return this.isLogged;
    }
  }

  //Metodo per assegnare lo stato di login dell'utente
  setLoggedStatus(){
    const isLoggedString = localStorage.getItem('isLogged');
    if (isLoggedString) {
      return isLoggedString === 'false';
    } else {
      return this.isLogged;
    }
  }


  toggleLogin(event: MouseEvent) {
    this.isLogged = !this.isLogged;
    this.setLogin()
    this.setTokens("", "")
    //chiamta a keycloack che invalida il token
    event.preventDefault()
  }

  //Metodo per creare l'header contenente l'access token
  permaHeader(){
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getAccessToken()
    });
  }
}
