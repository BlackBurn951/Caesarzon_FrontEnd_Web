import { Injectable } from '@angular/core';
import {Reports} from "../entities/Report";
import {Supports} from "../entities/Supports";
import {Bans} from "../entities/Bans";
import {Returns} from "../entities/Returns";
import {UserService} from "./userService";
import {UserSearch} from "../entities/UserSearch";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Reviews} from "../entities/Review";
import {Observable} from "rxjs";
import {PopupService} from "./popUpService";
import {HttpClient} from "@angular/common/http";
import {KeyCloakService} from "./keyCloakService";
import {ReportResponse} from "../entities/ReportResponseDTO";

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  section: number = 0;

  tipoRisposta: number = 0;

  usernameUtenteRisposta!: string;

  usernameUtenteDaBannare!: string;

  usernameUtenteBannato!: string;

  testoRecensione!: string;

  image!: SafeUrl

  reviewId!: string;

  //Definizione degli arrays
  users!: UserSearch[]
  bans!: Bans[]
  reports!: Reports[]
  supports!: Supports[]

  private reportURL = 'http://localhost:8090/notify-api/report';

  private reportAdminURL = 'http://localhost:8090/notify-api/admin/report';

  private banURL = 'http://localhost:8090/notify-api/ban';

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
    //Chiamata al metodo per svuotare gli arrays+
    this.clearArrays()

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
      });
    } else if (num == 1) {
      this.getReports(0).subscribe(reports => {
        this.reports = reports;
        this.reports.forEach( a =>{
          this.getReview(a.reviewId).subscribe(response =>{
            a.reviewText = response
          })
        })
      })
    } else if (num == 2) {
      this.getSupports(0).subscribe(supports => {
        this.supports = supports
      })
    } else if (num == 3) {
      this.getBans().subscribe(bans => {
        this.bans = bans
      })
    }
  }


  sendResponseAndDeleteReport(spiegazione: string, acc: boolean, username: string){
    let reportCode = ""
    this.reports.forEach(report => {
      if (report.usernameUser2 === username) {
          reportCode = report.id
      }
    });
    const reportResponse: ReportResponse = {
      accept: acc,
      explain: spiegazione,
      reportCode: reportCode
    }

    this.sendReportResponse(reportResponse).subscribe(
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

  sendReportResponse(reportResponse: ReportResponse): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    return this.http.post<any>(this.reportURL, reportResponse, { headers, responseType: 'text' as 'json' });
  }



  deleteReview(reviewId: string, accept: boolean){
    const headers = this.keycloakService.permaHeader()
    console.log("review id: "+ reviewId)
    console.log("accept: "+ accept)
    const urlWithParams = `${this.reportAdminURL}?review_id=${reviewId}&accept=${accept}`;
    console.log("URLSSSS: "+ urlWithParams)
    return this.http.delete<string>(urlWithParams, {headers, responseType: "text" as 'json'});

  }

  getReview(reviewId: string){
    const headers = this.keycloakService.permaHeader()
    const urlWithParams = this.getReviewURL+"/"+reviewId;
    return this.http.get<any>(urlWithParams, {headers, responseType: 'text' as 'json'});

  }

  sendReports(motivo: string, descrizione: string, username2: string) {
    const reports: Reports = {
      id: "",
      reason: motivo,
      description: descrizione,
      reportDate: "",
      usernameUser2: username2,
      usernameUser1: "",
      explain: "",
      reviewId: "",
      reviewText: ""

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
      explain: ""
    };

    this.sendHelp(supports).subscribe(
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

  sendHelp(support: Supports): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    return this.http.post<any>(this.supportURL, support, { headers, responseType: 'text' as 'json' });
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



}


