import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/userService";
import {AdminService} from "../services/adminService";
import {PopupService} from "../services/popUpService";
import {DomSanitizer} from "@angular/platform-browser";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css', '../../styles.css']
})
export class AdminAreaComponent implements OnInit{
  isCollapsed: any[]  = [];

  constructor(private keycloack: KeyCloakService, private productService: ProductService, private router: Router, private userService: UserService, protected adminService: AdminService, protected popUpService: PopupService) {
    this.isCollapsed = [];
  }

  changePageAdmin( page: string, username: string) {
    this.userService.username = username;
    this.router.navigate([page]);
  }


  toggleCollapse(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  ngOnInit(): void {
    this.keycloack.loading = true
    this.adminService.getUsers(false)
    this.adminService.resetArray()
    this.keycloack.getNotify().subscribe(notifies => {
      this.keycloack.notifications = notifies;
    });
    this.productService.ricerca =""
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

