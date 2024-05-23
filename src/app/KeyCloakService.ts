import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {

  private csrfTOKEN !: string;

  private accessTokenUrl = 'http://localhost:8080/realms/CaesarRealm/protocol/openid-connect/token';
  private sendAuthTokenUrl = 'http://localhost:58880/auth-api/login';
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
    this.sendTokens(Tokens);
  }

  sendTokens(Tokens: any): void {
    this.csrfTOKEN = document.cookie.replace(/(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$|^.*$/, '$1');
    console.log("SONO IL TOKEN PRESO CON DOCUMENT.COOKIE", this.csrfTOKEN)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': this.csrfTOKEN
    });

    this.http.post(this.sendAuthTokenUrl, Tokens, { headers , withCredentials: true}).subscribe(
      (data) => {
        console.log("ho fatto ye", data);
      },
      (error) => {
        console.error('Error during request:', error);
      }
    );
  }


  private apiUrl = 'http://localhost:58880/get-cookie';



  getCookie(): Observable<string> {
    return this.http.get(this.apiUrl, {responseType: 'text', withCredentials: true});
  }

  fetchCookie() {
    this.getCookie().subscribe(
      (data: string) => {
        console.log("COOKIE DAL SERVER: ", data)
        this.csrfTOKEN = document.cookie.replace(/(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$|^.*$/, '$1');
        console.log("SONO IL TOKEN PRESO CON DOCUMENT.COOKIE", this.csrfTOKEN)
      },
      (error: any) => {
        console.error('Error fetching cookie', error);
      }
    );
  }

testCors() {
    this.http.get("http://localhost:8090/auth-api/test", {responseType: 'text'}).subscribe(
      (response: any) => {
        console.log("RISPOSTA DAL SERVER: ", response)
      },
      (error: any) => {
        console.error('Errore nella chiamata testCors: ', error);
      }
    );
}

}
