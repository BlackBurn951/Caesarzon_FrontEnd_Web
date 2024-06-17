import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserRegistration} from "../entities/UserRegistration";
import {Observable, timeout} from "rxjs";
import {KeyCloakService} from "./keyCloakService";
import {User} from "../entities/User";
import {PopupService} from "./popUpService";
import {Reports} from "../entities/Report";
import {Helps} from "../entities/Supports";
import {Reviews} from "../entities/Review";


@Injectable({
  providedIn: 'root',
})
export class UserService {

  testoButton: string = "Modifica dati";
  inputAbilitato: boolean = false;

  loading: boolean = false;


  private manageUserDataURL = 'http://localhost:8090/user-api/user';

  private manageProfilePicURL = 'http://localhost:8090/user-api/image';

  private reportURL = 'http://localhost:8090/notify-api/report';
  private reviewURL = 'http://localhost:8090/notify-api/review';
  private helpURL = 'http://localhost:8090/notify-api/help';




  constructor( private http: HttpClient, private keycloakService: KeyCloakService, private popUp: PopupService) { }

  sendReports(motivo: string, descrizione: string, username2: string) {
    const reports: Reports = {
      motivo: motivo,
      descrizione: descrizione,
      dataSegnalazione: "",
      usernameUser2: username2

    };

    this.sendReport(reports).subscribe(
      response => {
        this.popUp.updateStringa("Segnalazione inviata correttamente!")
        this.popUp.openPopups(10, true)
      },
      error => {
        this.popUp.updateStringa("Problemi nell'invio della segnalazione!.")
        this.popUp.openPopups(10, true)
      }
    );
  }

  sendReport(report: Reports): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.post<any>(this.reportURL, report, { headers, responseType: 'text' as 'json' });
  }


  sendHelps(motivo: string, oggetto: string, descrizione: string) {
    const help: Helps = {
      motivo: motivo,
      descrizione: descrizione,
      oggetto: oggetto,
      dataRichiesta: ""
    };

    this.sendHelp(help).subscribe(
      response => {
        this.popUp.updateStringa("Richiesta di assistenza inviata correttamente!")
        this.popUp.openPopups(10, true)
      },
      error => {
        this.popUp.updateStringa("Problemi nell'invio della richiesta di assistenza!.")
        this.popUp.openPopups(10, true)
      }
    );
  }

  sendHelp(help: Helps): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.post<any>(this.helpURL, help, { headers, responseType: 'text' as 'json' });
  }

  sendReviews(numStelle: number, descrizione: string) {
    const review: Reviews = {
      numStelle: numStelle,
      descrizione: descrizione,
      dataRecensione: ""
    };

    this.sendReview(review).subscribe(
      response => {
        this.popUp.updateStringa("Recensione inviata correttamente!")
        this.popUp.openPopups(10, true)
      },
      error => {
        this.popUp.updateStringa("Problemi nell'invio della recensione!.")
        this.popUp.openPopups(10, true)
      }
    );
  }

  sendReview(reviews: Reviews): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.post<any>(this.reviewURL, reviews, { headers, responseType: 'text' as 'json' });
  }

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

  deleteUser(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.keycloakService.getAccessToken()
    });

    this.http.delete<string>(this.manageUserDataURL, { headers , responseType: 'text' as 'json' })
      .subscribe({
        next: (response) => {
          console.log('User eliminato con successo:', response);
          this.popUp.updateStringa(response)
          this.popUp.openPopups(10, true)
          this.keycloakService.setLoggedStatus()
          setTimeout(()=>{
            window.location.reload()
          }, 2000);


        },
        error: (error) => {
          console.error('Errore durante l\'eliminazione dell\'account', error);
        }
      });
  }

  sendUserData(userData: UserRegistration): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.post<any>(this.manageUserDataURL, userData, { headers, responseType: 'text' as 'json' });
  }

  getUserData(): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.get<User>(this.manageUserDataURL, { headers });
  }


  getUserProfilePic(): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloakService.getAccessToken() });
    return this.http.get(this.manageProfilePicURL, {headers, responseType: 'blob' });
  }

  modifyUser(username: string, email:string, firstName:string, lastName: string, phoneNumber: string) {
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
        this.popUp.updateStringa("Dati modificati con successo!")
        this.popUp.openPopups(10, true)
        this.testoButton = "Modifica dati"
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

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.keycloakService.getAccessToken()
    });

    return this.http.post(this.manageProfilePicURL, formData, { headers, responseType: 'text' as 'json' });
  }

  getUsers(){

  }

  getReports(){

  }

  getSupports(){

  }

  getBans(){

  }

  getReturns(){

  }

}
