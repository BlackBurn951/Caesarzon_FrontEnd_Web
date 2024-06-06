import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserRegistration} from "../entities/UserRegistration";
import {Observable, timeout} from "rxjs";
import {KeyCloakService} from "./keyCloakService";
import {User} from "../entities/User";
import {PopupService} from "./popUpService";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  testoButton: string = "Modifica dati";
  inputAbilitato: boolean = false;


  private manageUserDataURL = 'http://localhost:8090/user-api/user';



  constructor(private http: HttpClient, private keycloakService: KeyCloakService, private popUp: PopupService) { }


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
        this.popUp.updateStringa("Account creato correttamente! Verrai reinderizzato")
        this.popUp.openPopups(10, true)
        setTimeout(() => {
          this.keycloakService.login(username, credentialValue);
        }, 3000);
      },
      error => {
        this.popUp.updateStringa("Problemi nella creazione dell'account, riprova più tardi.")
        this.popUp.openPopups(10, true)
        console.error('Error sending user data:', error);
      }
    );
  }

  sendUserData(userData: UserRegistration): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.post<any>(this.manageUserDataURL, userData, { headers, responseType: 'text' as 'json' });
  }

  getUserData(): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.get<User>(this.manageUserDataURL, { headers });
  }

  modifyUser(username: string, email:string, firstName:string, lastName: string, phoneNumber: string) {
    console.log(username)
    console.log(email)
    console.log(firstName)
    console.log(lastName)
    console.log(phoneNumber)
    const userData: User = {
      id : "",
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber
    };

    this.modifyUserData(userData).subscribe(
      response => {
        this.popUp.updateStringa("Dati modificati con successo! (Verifica l'email se modificata)")
        this.popUp.openPopups(10, true)
        this.inputAbilitato = false
      },
      error => {
        console.error('Error sending user data:', error);
      }
    );
  }

  modifyUserData(userData: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.put<any>(this.manageUserDataURL, userData, { headers, responseType: 'text' as 'json' });
  }



}
