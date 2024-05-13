import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {

  private accessTokenUrl = 'http://localhost:8080/realms/CaesarRealm/protocol/openid-connect/token';

  private sendAuthTokenUrl = 'http://localhost:8090/auth-api/login';

  private ACCESS_TOKEN = "Ciao sono l'access_token"

  private REFRESH_TOKEN= "Ciao sono il refresh_token"

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
        this.sendToken()
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
    this.sendT(Tokens);
  }


  sendT(Tokens: any): Promise<any> {
    const url = this.sendAuthTokenUrl;
    return fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.ACCESS_TOKEN}`
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
        console.error('Errore durante la chiamata:', error);
        throw error;
      });
  }


}


