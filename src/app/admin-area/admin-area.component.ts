import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/userService";
import {AdminService} from "../services/adminService";
import {PopupService} from "../services/popUpService";
import {DomSanitizer} from "@angular/platform-browser";
import {Reports} from "../entities/Report";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css', '../../styles.css']
})
export class AdminAreaComponent implements OnInit{
  isCollapsed: any[]  = [];

  constructor(private sanitizer: DomSanitizer, private router: Router, private userService: UserService, protected adminService: AdminService, protected popUpService: PopupService) {
  }

  // Metodo per navigare ai dati personali dell'utente
  changePage( page: string, username: string) {
    this.router.navigate([page]);

    console.log(`Changing to page: ${page} for user: ${username}`);
  }


  toggleCollapse(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }


  deleteItem(index: number): void {
    this.isCollapsed.splice(index, 1);
  }

  ngOnInit(): void {
    console.log("SIAMO QUIII DAMMI IL TESTO:    "+this.adminService.testoRecensione)
    //Inizialmente la prima pagina mostrata è la ricerca degli utenti quindi carico i primi 20
    this.adminService.getUsers().subscribe(users => {
      this.adminService.users = users;
      this.adminService.users.forEach(user => {
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
  }


  eliminaRecensione(utente: number){
    const user = this.adminService.reports.at(utente);
    if (user) {
      this.adminService.usernameUtenteDaBannare = user.usernameUser2;
      this.adminService.reviewId = user.reviewId
      this.adminService.reportIndex = utente;
    }
    this.popUpService.operazione = 0;
    this.popUpService.updateStringa("Sei sicuro di voler eliminare la recensione di: " + this.adminService.usernameUtenteDaBannare+"?")
    this.popUpService.openPopups(141, false);
  }

  scartaSegnalazione(utente: number){
    const user = this.adminService.reports.at(utente);
    if (user)
      this.adminService.usernameUtenteDaBannare = user.usernameUser2;

    this.popUpService.operazione = 1;
    this.popUpService.updateStringa("Sei sicuro di voler scartare la segnalazione in merito all'utente: " + this.adminService.usernameUtenteDaBannare+"?")
    this.popUpService.openPopups(141, false);
  }

  inviaRisposta(utente: number){
    const user = this.adminService.supports.at(utente);
    if (user) {
      this.adminService.usernameUtenteRisposta = user.username;
      this.adminService.idSupport = user.id
      this.adminService.supportIndex = utente
    }
    this.popUpService.aStringa = "Rispondi all'utente " + this.adminService.usernameUtenteRisposta
    this.popUpService.openPopups(10, true)
  }

  rimuoviBan(utente: number){
    this.popUpService.operazione = 2;
    this.popUpService.updateStringa("Sei sicuro di voler rimuovere il ban di: " + this.adminService.usernameUtenteBannato+"?")
    this.popUpService.openPopups(141, false);
  }



}

