import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {

  csrfToken!: string;

  private accessTokenUrl = 'http://localhost:8080/realms/CaesarRealm/protocol/openid-connect/token';
  private sendAuthTokenUrl = 'http://localhost:8090/auth-api/login';
  private getCsrfTokenUrl = 'http://localhost:8090/csrf-token';

  private ACCESS_TOKEN!:string;
  private REFRESH_TOKEN!:string;

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
        this.getCsrfToken()
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
      _csrf: this.csrfToken // Include il token CSRF qui
    };
    this.sendT(Tokens);
  }

  sendT(Tokens: any): Promise<any> {
    const url = this.sendAuthTokenUrl;
    return this.http.post(url, Tokens).toPromise(); // Non c'è bisogno di utilizzare fetch, puoi usare direttamente HttpClient
  }

  getCsrfToken() {
    this.getTekken().subscribe((data: any) => {
      this.csrfToken = data.csrfToken;
    });
  }

  getTekken() {
    return this.http.get(this.getCsrfTokenUrl);
  }
}
