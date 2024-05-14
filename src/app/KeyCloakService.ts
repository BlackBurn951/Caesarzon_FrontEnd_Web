import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {

  csrfToken!: string;

  private accessTokenUrl = 'http://localhost:8080/realms/CaesarRealm/protocol/openid-connect/token';
  private sendAuthTokenUrl = 'http://localhost:60284/auth-api/login';
  private ACCESS_TOKEN!: string;
  private REFRESH_TOKEN!: string;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

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
    const tokens = {
      access: this.ACCESS_TOKEN,
      refresh: this.REFRESH_TOKEN,
    };
    this.sendTokens(tokens);
  }

  sendTokens(tokens: any): void {
    console.log("SONO NELLA CHIAMATA SEND TOKENS: ", this.csrfToken)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': this.csrfToken
    });

    this.http.post(this.sendAuthTokenUrl, tokens, { headers }).subscribe(
      (data) => {
        console.log("ho fatto ye", data);
      },
      (error) => {
        console.error('Error during request:', error);
      }
    );
  }

  getCsrfTokens(): Observable<string> {
    return this.http.get("http://localhost:60284/get-csrf-token", { responseType: 'text' });
  }

  getCsrfToken(): void {
    this.getCsrfTokens()
      .subscribe(token => {
        this.csrfToken = token;
        console.log('CsrfToken:', this.csrfToken);
      });
  }


}
