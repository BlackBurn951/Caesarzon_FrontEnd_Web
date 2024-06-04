import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Router} from "@angular/router";
import {PopupService} from "./popUpService";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {

  private accessTokenUrl = 'http://localhost:8080/realms/CaesarRealm/protocol/openid-connect/token';

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
        this.isLogged = true;
        console.log("UTOKEN: ", this.ACCESS_TOKEN);
        this.popUp.closePopup()

      },
      (error) => {
        console.error("Error during request:", error);
      }
    );

  }

  setTokens(accessToken: string, refreshToken: string) {
    this.ACCESS_TOKEN = accessToken;
    this.REFRESH_TOKEN = refreshToken;
  }


  getAccessToken() {
    return this.ACCESS_TOKEN;
  }

  getLoggedStatus(){
    return this.isLogged
  }

  toggleLogin(event: MouseEvent) {
    this.isLogged = !this.isLogged;
    event.preventDefault()
  }
}
