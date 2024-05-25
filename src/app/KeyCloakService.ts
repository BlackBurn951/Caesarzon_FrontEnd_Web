import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {


  private accessTokenUrl = 'http://localhost:8080/realms/CaesarRealm/protocol/openid-connect/token';

  private sendAuthTokenUrl = "http://localhost:8090/auth-api/test";

  private test = "http://localhost:8090/user-api/users";

  private ACCESS_TOKEN!: string;
  private REFRESH_TOKEN!: string;

  constructor(private http: HttpClient) { }


  login(username: string, password: string): void {
    this.generateToken(username, password);
  }

  generateToken(username: string, password: string): void{
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'login-app');
    body.set('username', username);
    body.set('password', password);

    this.http.post(this.accessTokenUrl, body.toString(), { headers, withCredentials: true }).subscribe(
      (response:any) => {
        this.setTokens(response.access_token, response.refresh_token);
        console.log("UTOKEN: ", this.ACCESS_TOKEN);

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

  sendToken() {
    const Tokens = {
      access: this.ACCESS_TOKEN,
      refresh: this.REFRESH_TOKEN,
    };
    this.sendTokens(Tokens);
  }

  sendTokens(Tokens: any): void {
    console.log("UTOKEN: ", this.ACCESS_TOKEN);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`

    });

    this.http.post(this.sendAuthTokenUrl, Tokens, { headers, responseType: 'text' as 'json' }).subscribe(
      (data) => {
        console.log("Response received", data);
      },
      (error) => {
        console.error('Error during request:', error);
      }
    );
  }




  prova(event: Event) {
    event.preventDefault();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });

    this.http.get(this.test, { responseType: 'text', headers: headers}).subscribe(
      (response: any) => {
        console.log("RISPOSTA DAL SERVER: ", response);
      },
      (error: any) => {
        console.error('Errore nella chiamata testCors: ', error);
      }
    );
  }




}
