import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {

  private accessTokenUrl = 'http://localhost:8080/realms/CaesarRealm/protocol/openid-connect/token';

  private sendAuthTokenUrl = 'http://localhost:8088/auth-api/login';

  private ACCESS_TOKEN!: string;

  private REFRESH_TOKEN!: string;

  constructor(private http: HttpClient) { }

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
      },
      (error) => {
        console.error("Error during request:", error);
      }
    );


    this.sendToken();

  }

  setTokens(accessToken: string, refreshToken: string) {
    this.ACCESS_TOKEN = accessToken;
    this.REFRESH_TOKEN = refreshToken;
  }


  sendToken() {
    const Token = {
      access: this.ACCESS_TOKEN,
      refresh: this.REFRESH_TOKEN,

    };
    this.sendT(Token);
  }


  sendT(Tokens: any): Promise<any> {
    const url = `${this.sendAuthTokenUrl}`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Tokens),
      credentials: 'omit'
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Errore durante la chiavata:', error);
        throw error;
      });
  }


}


