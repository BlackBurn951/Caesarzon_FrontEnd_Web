import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserRegistration} from "../entities/UserRegistration";
import {Observable} from "rxjs";
import {KeyCloakService} from "./keyCloakService";
import {User} from "../entities/User";

@Injectable({
  providedIn: 'root',
})
export class UserService {


  private sendUserDataURL = 'http://localhost:8090/user-api/user';

  private getUserDataURL = 'http://localhost:8090/user-api/user';


  constructor(private http: HttpClient, private keycloakService: KeyCloakService) { }


  sendUser(username: string, email:string, firstName:string, lastName: string, credentialValue: string) {
    const userData: UserRegistration = {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      credentialValue: credentialValue
    };

    this.sendUserData(userData).subscribe(
      response => {
        console.log('User data sent successfully:', response);
      },
      error => {
        console.error('Error sending user data:', error);
      }
    );
  }

  sendUserData(userData: UserRegistration): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.post<any>(this.sendUserDataURL, userData, { headers, responseType: 'text' as 'json' });
  }

  getUserData(): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.get<User>(this.getUserDataURL, { headers });
  }



}
