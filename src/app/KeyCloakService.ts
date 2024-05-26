import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class KeyCloakService {


  private accessTokenUrl = 'http://localhost:8080/realms/CaesarRealm/protocol/openid-connect/token';

  private registrationUrl = 'http://localhost:8080/admin/realms/CaesarRealm/users';

  private test = "http://localhost:8090/user-api/users";

  private ACCESS_TOKEN!: string;
  private REFRESH_TOKEN!: string;

  constructor(private http: HttpClient) { }

  refreshAuthVariables(){
    this.ACCESS_TOKEN = "";
    this.REFRESH_TOKEN = "";
    console.log("Acc", this.ACCESS_TOKEN)
    console.log("REf", this.REFRESH_TOKEN)
  }



  login(username: string, password: string): void{
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



  registration(email: string, firstName: string, lastName: string, enabled: boolean, username: string, password: string): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`
    });

    const requestBody = `
    {
      "username": "${username}",
      "email": "${email}",
      "firstName": "${firstName}",
      "lastName": "${lastName}",
      "enabled": ${enabled},
      "credentials": [{
        "type": "password",
        "value": "${password}"
      }]
    }
  `;

    this.http.post(this.registrationUrl, requestBody, { headers, responseType: 'text' as 'json' }).subscribe(
      (response: any) => {
        console.log("Response from registration to Keycloak: ", response);
      },
      (error) => {
        console.error("Error during request:", error);
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
