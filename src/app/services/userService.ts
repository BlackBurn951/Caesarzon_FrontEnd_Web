import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserData} from "../entities/UserData";
import {Observable} from "rxjs";
import {user} from "../utils/user";
import {KeyCloakService} from "./keyCloakService";

@Injectable({
  providedIn: 'root',
})
export class UserService {


  private sendUserDataURL = 'http://localhost:8090/user-api/user';


  constructor(private http: HttpClient, private keycloakService: KeyCloakService) { }


  sendUser(username: string, email:string, firstName:string, lastName: string, enabled: boolean, credentialType: string, credentialValue: string) {
    const userData: UserData = {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      enabled: enabled,
      credentialType: credentialType,
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

  sendUserData(userData: UserData): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.post<any>(this.sendUserDataURL, userData, { headers });
  }



}
