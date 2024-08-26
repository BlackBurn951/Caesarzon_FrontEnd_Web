import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/userService";
import {AdminService} from "../services/adminService";
import {PopupService} from "../services/popUpService";
import {DomSanitizer} from "@angular/platform-browser";
import {Reports} from "../entities/Report";
import {KeyCloakService} from "../services/keyCloakService";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css', '../../styles.css']
})
export class AdminAreaComponent implements OnInit{
  isCollapsed: any[]  = [];

  constructor(private keycloack: KeyCloakService, private sanitizer: DomSanitizer, private router: Router, private userService: UserService, protected adminService: AdminService, protected popUpService: PopupService) {
    this.isCollapsed = [];
  }

  // Metodo per navigare ai dati personali dell'utente
  changePage( page: string, username: string) {
    this.userService.username = username
    this.router.navigate([page]);
  }


  toggleCollapse(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }


  deleteItem(index: number): void {
    this.isCollapsed.splice(index, 1);
  }

  ngOnInit(): void {
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

    this.keycloack.getNotify().subscribe(notifies => {
      this.keycloack.notifications = notifies;
    })
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
    if (user) {
      this.adminService.usernameUtenteDaBannare = user.usernameUser2;
    }

    this.popUpService.operazione = 7;
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

  rimuoviBan(utente: string){
    this.adminService.usernameUtenteBannato = utente
    this.popUpService.operazione = 10;
    this.popUpService.updateStringa("Sei sicuro di voler rimuovere il ban di: " + utente+"?")
    this.popUpService.openPopups(141, false);
  }



}

