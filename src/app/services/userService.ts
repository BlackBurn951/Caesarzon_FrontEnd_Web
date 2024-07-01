import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserRegistration} from "../entities/UserRegistration";
import {Observable} from "rxjs";
import {KeyCloakService} from "./keyCloakService";
import {User} from "../entities/User";
import {PopupService} from "./popUpService";
import {Reviews} from "../entities/Review";
import {PasswordChange} from "../entities/PasswordChange";


@Injectable({
  providedIn: 'root',
})
export class UserService {

  testoButton: string = "Modifica dati";

  inputAbilitato: boolean = false;

  loading: boolean = false;

  private manageUserDataURL = 'http://localhost:8090/user-api/user';

  private managePasswordURL = 'http://localhost:8090/user-api/password';

  private manageProfilePicURL = 'http://localhost:8090/user-api/image';

  private reviewURL = 'http://localhost:8090/notify-api/review';


  constructor( private http: HttpClient, private keycloakService: KeyCloakService, private popUp: PopupService) { }





  cambioPassword(password: string){
    const passwordChange: PasswordChange = {
      username: "",
      password: password
    };

    this.sendPasswordChange(passwordChange).subscribe(
      response => {
        this.popUp.updateStringa("Password cambiata correttamente!")
        this.popUp.openPopups(10345, true)
      },
      error => {
        this.popUp.updateStringa("Problemi nel cambio della password.")
        this.popUp.openPopups(10435, true)
      }
    );
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
        this.popUp.openPopups(103, true)
        setTimeout(() => {
          this.keycloakService.login(username, credentialValue);
        }, 3000);
      },
      error => {
        this.popUp.updateStringa("Problemi nella creazione dell'account, riprova più tardi.")
        this.popUp.openPopups(1034, true)
        console.error('Error sending user data:', error);
      }
    );
  }

  deleteUser(){
    const headers = this.keycloakService.permaHeader()

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


  sendPasswordChange(passwordChange: PasswordChange): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    const customUrl = this.managePasswordURL+"?recovery=false"
    return this.http.put<any>(customUrl, passwordChange, { headers, responseType: 'text' as 'json' });
  }

  sendUserData(userData: UserRegistration): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    return this.http.post<any>(this.manageUserDataURL, userData, { headers, responseType: 'text' as 'json' });
  }

  getUserData(): Observable<User> {
    const headers = this.keycloakService.permaHeader()
    return this.http.get<User>(this.manageUserDataURL, { headers });
  }


  getUserProfilePic(): Observable<Blob> {
    const headers = this.keycloakService.permaHeader()
    return this.http.get(this.manageProfilePicURL, {headers, responseType: 'blob' });
  }

  getUserProfilePicByUser(username: string): Observable<Blob> {
    const headers = this.keycloakService.permaHeader()
    const customUrl = this.manageProfilePicURL + '/' + username;
    console.log("url completo: " + customUrl)
    return this.http.get(customUrl, {headers, responseType: 'blob' });
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
        this.popUp.openPopups(1450, true)
        this.testoButton = "Modifica dati"
        this.inputAbilitato = false
      },
      error => {
        console.error('Error sending user data:', error);
      }
    );
  }


  modifyUserData(userData: User): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    return this.http.put<string>(this.manageUserDataURL, userData, { headers, responseType: 'text' as 'json' });
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.keycloakService.getAccessToken()
    });


    return this.http.put(this.manageProfilePicURL, formData, { headers, responseType: 'text'});
  }






}
