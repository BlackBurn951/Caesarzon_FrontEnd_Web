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

  testoRecensione!: string;

  motivoRichiesta: string = '';
  oggetto: string = '';
  descrizioneRichiesta: string = '';

  motivoSegnalazione!: string;
  descrizioneSegnalazione!: string;
  usernameSegnalato!: string;

  image!: SafeUrl

  reviewId!: string;

  //Definizione degli arrays
  users!: UserSearch[]
  bans!: Bans[]
  reports!: Reports[]
  supports!: Supports[]

  private reportURL = 'http://localhost:8090/notify-api/report';

  private reportAdminURL = 'http://localhost:8090/notify-api/admin/report';

  private banURL = 'http://localhost:8090/user-api/bans';

  private supportURL = 'http://localhost:8090/notify-api/support';

  private getUsersUrl = 'http://localhost:8090/user-api/users';

  private getReviewURL = 'http://localhost:8090/product-api/review';

  constructor(private sanitizer: DomSanitizer ,private userService: UserService, private popUp: PopupService, private http: HttpClient, private keycloakService: KeyCloakService) {
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
        this.users.forEach(user => {
          if (user.username === "francusso") {
            this.userService.getUserProfilePicByUser(user.username).subscribe(
              response => {
                const url = URL.createObjectURL(response);
                user.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
              },
              error => {
                console.error('Errore nel caricamento dell\'immagine', error);
              }
            );
          }
        });
        this.userService.loading = false
      });
    } else if (num == 1) {
      this.getReports(0).subscribe(reports => {
        this.reports = reports;
        this.reports.forEach( a =>{
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
      this.getBans(0).subscribe(bans => {
        this.bans = bans
        this.userService.loading = false
      })
    }
  }






  deleteReview(reviewId: string, accept: boolean){
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
    return this.http.get<any>(urlWithParams, {headers, responseType: 'text' as 'json'});

  }


  inviaSegnalazione(){
    this.popUp.openPopups(1, true);
  }

  sendReports() {
    console.log("SOno nella funzione")
    const reports: Reports = {
      id: "",
      reason: this.motivoSegnalazione,
      description: this.descrizioneSegnalazione,
      reportDate: "",
      usernameUser2: "cesare",
      usernameUser1: "",
      explain: "",
      reviewId: "",
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

  getBans(num: number){
    const customUrl = this.supportURL+"?str="+num
    const headers = this.keycloakService.permaHeader()
    return this.http.get<Bans[]>(customUrl, { headers });
  }



}


