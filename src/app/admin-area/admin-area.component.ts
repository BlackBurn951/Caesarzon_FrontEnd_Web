import {Component, OnInit} from '@angular/core';
import {Event, Router} from "@angular/router";
import {Reports} from "../entities/Report";
import {Bans} from "../entities/Bans";
import * as console from "node:console";
import {UserService} from "../services/userService";
import {UserSearch} from "../entities/UserSearch";
import {Returns} from "../entities/Returns";
import {BehaviorSubject, Observable} from "rxjs";
import {Supports} from "../entities/Supports";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css', '../../styles.css']
})
export class AdminAreaComponent implements OnInit{
  section: number = 0;
  isCollapsed: boolean[] = [];
  usernames: string[] = ['mnytgctfmmmmttymfmfm', 'tttttttttttttttttttt', 'user3'];


  //Definizione degli arrays
  users!: UserSearch[]
  reports!: Reports[]
  supports!: Supports []
  bans!: Bans[]
  returns!: Returns []


  constructor( private router: Router, private userService: UserService) {
  }

  //Metodo per svuotare gli arrays
  clearArrays(): void {
    this.users = []
    this.reports = []
    this.supports = []
    this.bans = []
    this.returns = []
  }


  //Al campio della selection vengono svuotate e popolate le rispettive liste con un numero di elementi inziale di 20
  changeSection(num: number) {
    this.section = num;
    //Chiamata al metodo per svuotare gli arrays+
    this.clearArrays()

    if(num == 0){
      this.userService.getUsers().subscribe(users =>{
        this.users = users;
      })
    }else if(num == 1){
      this.reports = this.userService.getReports();
    }else if(num == 2){
      this.supports = this.userService.getSupports();
    }else if(num == 3){
      this.bans = this.userService.getBans();
    }else if(num == 4){
      this.returns = this.userService.getReturns();
    }
  }


  // Metodo per navigare ai dati personali dell'utente
  changePage(event: Event, page: string, username: string) {
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
    //Inizialmente la prima pagina mostrata è la ricerca degli utenti quindi carico i primi 20
    this.userService.getUsers()
  }


}

