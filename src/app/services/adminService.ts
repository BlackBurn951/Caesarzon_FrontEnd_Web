import { Injectable } from '@angular/core';
import {Reports} from "../entities/Report";
import {Supports} from "../entities/Supports";
import {Bans} from "../entities/Bans";
import {UserService} from "./userService";
import {UserSearch} from "../entities/UserSearch";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {PopupService} from "./popUpService";
import {HttpClient} from "@angular/common/http";
import {KeyCloakService} from "./keyCloakService";
import {Sban} from "../entities/Sban";
import {User} from "../entities/User";
import {BanDTO} from "../entities/BanDTO";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  section: number = 0;

  rispostaAdmin: string = "";
  idSupport!: string;
  supportIndex!: number;

  reportIndex!: number;

  usernameUtenteRisposta!: string;

  usernameUtenteDaBannare!: string;

  usernameUtenteBannato!: string;

  motivoRichiesta: string = '';
  oggetto: string = '';
  descrizioneRichiesta: string = '';

  motivoSegnalazione: string = ""
  descrizioneSegnalazione: string = ""
  usernameSegnalato: string = ""

  image!: SafeUrl

  reviewId!: string;

  //Definizione degli arrays
  users!: UserSearch[]
  bans!: Bans[]
  reports!: Reports[]
  supports!: Supports[]

  private reportURL = 'http://localhost:8090/notify-api/report';

  private reportAdminURL = 'http://localhost:8090/notify-api/admin/report';

  private banURL = 'http://localhost:8090/notify-api/bans';

  private sbanUserURL = 'http://localhost:8090/user-api/sban';

  private banUserURL = 'http://localhost:8090/user-api/ban';

  private supportURL = 'http://localhost:8090/notify-api/support';

  private getUsersUrl = 'http://localhost:8090/user-api/users';

  private getReviewURL = 'http://localhost:8090/product-api/review';

  private manageUserDataURL = 'http://localhost:8090/user-api/user/';

  private manageProfilePicURL = 'http://localhost:8090/user-api/image/';


  constructor(private router: Router, private sanitizer: DomSanitizer ,private userService: UserService, private popUp: PopupService, private http: HttpClient, private keycloakService: KeyCloakService) {
  }


  //Metodo per svuotare gli arrays
  clearArrays(): void {
    this.users = []
    this.reports = []
    this.supports = []
    this.bans = []
  }

  //Al campio della selection vengono svuotate e popolate le rispettive liste con un numero di elementi inziale di 20
  changeSection(num: number) {
    this.section = num;
    this.clearArrays()
    this.userService.loading = true

    if (num == 0) {
      this.getUsers().subscribe(users => {
        this.users = users;
        this.users.forEach(user =>{
          this.getUserProfilePic(user.username).subscribe(
            response => {
              const url = URL.createObjectURL(response);
              user.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);

            },
            error => {
              console.error('Errore nel caricamento dell\'immagine', error);
            }
          );
        })
      });
      this.userService.loading = false

    } else if (num == 1) {
      this.getReports(0).subscribe(reports => {
        this.reports = reports;

        this.reports.forEach( a =>{
          console.log("DATI" + a.reason)
          console.log("DATI" + a.usernameUser2)
          console.log("DATI" + a.usernameUser1)
          console.log("DATI" + a.reviewId)
          console.log("DATI" + a.reviewText)
          this.getReview(a.reviewId).subscribe(response =>{
            a.reviewText = response
          })
        })
        this.userService.loading = false

      })
    } else if (num == 2) {
      this.getSupports(0).subscribe(supports => {
        this.supports = supports
        this.userService.loading = false
      })
    } else if (num == 3) {
      this.getBans().subscribe(bans => {
        this.bans = bans
        this.userService.loading = false
      })
    }
  }


  getUserData(username: string): Observable<User> {
    const headers = this.keycloakService.permaHeader()
    const customURL = this.manageUserDataURL+username
    return this.http.get<User>(customURL, { headers });
  }


  getUserProfilePic(username: string): Observable<Blob> {
    const headers = this.keycloakService.permaHeader()
    const customURL = this.manageProfilePicURL+username
    return this.http.get(customURL, {headers, responseType: 'blob' });
  }

  adminModifyUser(username: string, email:string, firstName:string, lastName: string, phoneNumber: string) {
    const userData: User = {
      id : "",
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber
    };

    this.adminModifyUserData(userData).subscribe(
      response => {
        this.popUp.updateStringa("Dati modificati con successo!")
        this.popUp.openPopups(1450, true)
        this.userService.testoButton = "Modifica dati"
        this.userService.inputAbilitato = false
      },
      error => {
        console.error('Error sending user data:', error);
      }
    );
  }

  adminModifyUserData(userData: User): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    const customURL = this.manageUserDataURL+'/'+this.userService.username
    return this.http.put<string>(customURL, userData, { headers, responseType: 'text' as 'json' });
  }

  adminDeleteUser(){
    const headers = this.keycloakService.permaHeader()
    const customURL = this.manageUserDataURL+'/'+this.userService.username

    this.http.delete<string>(customURL, { headers , responseType: 'text' as 'json' })
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


  deleteReport(reviewId: string, accept: boolean){
    const headers = this.keycloakService.permaHeader()
    const urlWithParams = `${this.reportAdminURL}?review_id=${reviewId}&accept=${accept}`;
    return this.http.delete<string>(urlWithParams, {headers, responseType: "text" as 'json'});

  }



  inviaRisposta(){
    this.sendResponse().subscribe( response =>{
      if(response == "Richiesta di supporto eliminata con successo"){
        this.popUp.closePopup()
        this.supports.splice(this.supportIndex, 1);
        this.rispostaAdmin = ""
        this.popUp.updateStringa(response)
        this.popUp.openPopups(123, true);
      }
    })
  }


  sendResponse(){
    const headers = this.keycloakService.permaHeader()
    console.log(this.idSupport)
    console.log(this.rispostaAdmin)
    const urlWithParams = `${this.supportURL}?support-id=${this.idSupport}&explain=${this.rispostaAdmin}`;
    return this.http.delete<string>(urlWithParams, {headers, responseType: "text" as 'json'});
  }

  getReview(reviewId: string){
    const headers = this.keycloakService.permaHeader()
    const urlWithParams = this.getReviewURL+"/"+reviewId;
    return this.http.get<string>(urlWithParams, {headers, responseType: 'text' as 'json'});

  }


  sendReports() {
    console.log("SOno nella funzione")
    const reports: Reports = {
      id: "",
      reason: this.motivoSegnalazione,
      description: this.descrizioneSegnalazione,
      reportDate: "",
      usernameUser2: this.usernameSegnalato,
      usernameUser1: "",
      explain: "",
      reviewId: this.reviewId,
      reviewText: ""

    };

    this.sendReport(reports).subscribe(
      response => {
        if(response === "Segnalazione inviata con sucesso!")
          this.motivoSegnalazione = "";
          this.descrizioneSegnalazione = ""
          this.usernameSegnalato = ""
          this.popUp.closePopup()
          this.popUp.updateStringa("Segnalazione inviata correttamente!")
          this.popUp.openPopups(14124, true)
      },
      error => {
        this.motivoSegnalazione = "";
        this.descrizioneSegnalazione = ""
        this.usernameSegnalato = ""
        this.popUp.closePopup()
        this.popUp.updateStringa("Problemi nell'invio della segnalazione!.")
        this.popUp.openPopups(1123, true)
      }
    );
  }

  sendReport(report: Reports): Observable<any> {
    console.log("SOno nella chiamata")

    const headers = this.keycloakService.permaHeader()
    return this.http.post<any>(this.reportURL, report, { headers, responseType: 'text' as 'json' });
  }


  sendHelps(motivo: string, oggetto: string, descrizione: string) {
    const supports: Supports = {
      id: "",
      username: "",
      type: motivo,
      text: descrizione,
      subject: oggetto,
      dateRequest: "",
    };

    this.sendHelp(supports).subscribe(
      response => {
        if(response === "Richiesta di supporto inviata con successo!")
          this.oggetto = ""
          this.descrizioneRichiesta = ""
          this.motivoRichiesta = ""
          this.popUp.updateStringa("Richiesta di assistenza inviata correttamente!")
          this.popUp.openPopups(1440, true)
      },
      error => {
        this.popUp.updateStringa("Problemi nell'invio della richiesta di assistenza!.")
        this.popUp.openPopups(1440, true)
      }
    );
  }

  sendHelp(support: Supports): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    return this.http.post<string>(this.supportURL, support, { headers, responseType: 'text' as 'json' });
  }

  getUsers(){
    const customURL = this.getUsersUrl+"?str=0"
    const headers = this.keycloakService.permaHeader()
    return this.http.get<UserSearch[]>(customURL, { headers });
  }

  getReports(num: number){
    const customUrl = this.reportURL+"?num="+num
    const headers = this.keycloakService.permaHeader()
    return this.http.get<Reports[]>(customUrl, { headers });
  }

  getSupports(num: number){
    const customUrl = this.supportURL+"?num="+num
    const headers = this.keycloakService.permaHeader()
    return this.http.get<Supports[]>(customUrl, { headers });
  }

  getBans(){
    const headers = this.keycloakService.permaHeader()
    return this.http.get<Bans[]>(this.banURL, { headers });
  }


  banUtente(){
    const headers = this.keycloakService.permaHeader()

    const banDTO : BanDTO = {
      reason: this.descrizioneSegnalazione,
      userUsername : this.userService.username,
      adminUsername : "",
      startDate: "",
      endDate: ""
    }

    return this.http.post<string>(this.banUserURL, banDTO, { headers , responseType: 'text' as 'json'}).subscribe( response =>{
      if(response === "Utente bannato con successo"){
        this.popUp.closePopup()
        this.popUp.updateStringa(response)
        this.popUp.openPopups(140, true)
        this.router.navigate(['']);
      }else{
        this.popUp.updateStringa(response)
        this.popUp.openPopups(140, true)
      }
    })


  }

  rimuoviBan(){
    const headers = this.keycloakService.permaHeader()
    const sbanDTO : Sban = {
      username : this.usernameUtenteBannato
    }
    return this.http.put<string>(this.sbanUserURL, sbanDTO, { headers , responseType: 'text' as 'json'});
  }



}


