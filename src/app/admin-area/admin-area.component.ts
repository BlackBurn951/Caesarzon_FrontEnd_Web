import {Component, OnInit} from '@angular/core';
import {Event, Router} from "@angular/router";
import {Reports} from "../entities/Report";
import {Bans} from "../entities/Bans";
import {UserService} from "../services/userService";
import {UserSearch} from "../entities/UserSearch";
import {Returns} from "../entities/Returns";
import {Supports} from "../entities/Supports";
import {AdminService} from "../services/adminService";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css', '../../styles.css']
})
export class AdminAreaComponent implements OnInit{
  isCollapsed: boolean[] = [];
  usernames: string[] = ['mnytgctfmmmmttymfmfm', 'tttttttttttttttttttt', 'user3'];

  constructor(private router: Router, private userService: UserService, protected adminService: AdminService) {
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
    //Inizialmente la prima pagina mostrata è la ricerca degli utenti quindi carico i primi 20
    this.userService.getUsers()
  }




}

