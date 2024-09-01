import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/userService";
import {AdminService} from "../services/adminService";
import {PopupService} from "../services/popUpService";
import {DomSanitizer} from "@angular/platform-browser";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";
import {Reports} from "../entities/Report";
import {Bans} from "../entities/Bans";
import {Supports} from "../entities/Supports";
import {UserSearch} from "../entities/UserSearch";

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

  accetta(reportId: string, utente: number){
    const user = this.adminService.reports.at(utente);
    if (user) {
      this.adminService.usernameUtenteDaBannare = user.usernameUser2;
      this.adminService.reportId = reportId
      this.adminService.reportIndex = utente;
    }
    this.popUpService.operazione = 0;
    this.popUpService.updateStringa("Sei sicuro di voler eliminare la recensione di: " + this.adminService.usernameUtenteDaBannare+"?")
    this.popUpService.openPopups(141, false);
  }

  scartaSegnalazione(reportId:string, utente: number){
    const user = this.adminService.reports.at(utente);
    if (user) {
      this.adminService.reportId = reportId
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




  userSearchTerm: string = '';
  reportSearchTerm: string = '';
  supportSearchTerm: string = '';
  banSearchTerm: string = '';

  sortKey: string = '';
  sortOrder: boolean = true;


  // Metodo per ordinare gli utenti
  sortUsers(key: keyof UserSearch) {
    this.sortKey = key;
    this.sortOrder = !this.sortOrder;
    this.adminService.users.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue === null || bValue === null) {
        return 0;
      }
      return this.sortOrder ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }

  // Metodo per ordinare le segnalazioni
  sortReports(key: keyof Reports) {
    this.sortKey = key;
    this.sortOrder = !this.sortOrder;
    this.adminService.reports.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue === null || bValue === null) {
        return 0;
      }
      return this.sortOrder ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }

  // Metodo per ordinare le richieste di supporto
  sortSupports(key: keyof Supports) {
    this.sortKey = key;
    this.sortOrder = !this.sortOrder;
    this.adminService.supports.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue === null || bValue === null) {
        return 0;
      }
      return this.sortOrder ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }

  // Metodo per ordinare i ban degli utenti
  sortBans(key: keyof Bans) {
    this.sortKey = key;
    this.sortOrder = !this.sortOrder;
    this.adminService.bans.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue === null || bValue === null) {
        return 0;
      }
      return this.sortOrder ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }


}

