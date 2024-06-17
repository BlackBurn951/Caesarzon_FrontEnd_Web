import {Component, OnInit} from '@angular/core';
import {Event, Router} from "@angular/router";
import {Reports} from "../entities/Report";
import {Helps, Supports} from "../entities/Supports";
import {Bans} from "../entities/Bans";
import * as console from "node:console";
import {UserService} from "../services/userService";
import {UserSearch} from "../entities/UserSearch";
import {Returns} from "../entities/Returns";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css', '../../styles.css']
})
export class AdminAreaComponent implements OnInit{
  section: number = 0;
  isCollapsed: boolean[] = [];
  usernames: string[] = ['mnytgctfmmmmttymfmfm', 'tttttttttttttttttttt', 'user3'];

  users!: UserSearch[];
  reports!: Reports[];
  supports!: Supports[];
  bans!: Bans[];
  returns!: Returns[];


  constructor( private router: Router, private userService: UserService) {
  }

  changeSection(num: number) {
    this.section = num;
    if(num == 0){
      this.users = this.userService.getUsers();
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

  changePage(event: Event, page: string, username: string) {
    // Implementa la logica per cambiare pagina e gestire l'username

    this.router.navigate([page]);

    console.log(`Changing to page: ${page} for user: ${username}`);
  }

  toggleCollapse(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  deleteItem(index: number): void {
    // Codice per eliminare l'elemento dall'array items
    // Aggiorna l'array isCollapsed se necessario
    this.reports.splice(index, 1);
    this.isCollapsed.splice(index, 1);
  }

  ngOnInit(): void {

    this.userService.getUsers()
  }


}

