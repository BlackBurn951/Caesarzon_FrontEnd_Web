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

  private isLogged = false;

  constructor(private http: HttpClient, private popUp: PopupService) { }

  refreshAuthVariables(){
    this.ACCESS_TOKEN = "";
    this.REFRESH_TOKEN = "";
  }


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

  setTokens(accessToken: string, refreshToken: string) {
    this.ACCESS_TOKEN = accessToken;
    this.REFRESH_TOKEN = refreshToken;
    localStorage.setItem('access_token', accessToken);
  }

  setLogin(){
    localStorage.setItem('isLogged', String(this.isLogged));

  }


  getAccessToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      return token;
    } else {
      return this.ACCESS_TOKEN;
    }
  }

  getLoggedStatus(){
    const isLoggedString = localStorage.getItem('isLogged');
    if (isLoggedString) {
      return isLoggedString === 'true';
    } else {
      return this.isLogged;
    }
  }

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
}
