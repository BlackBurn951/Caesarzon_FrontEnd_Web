import { Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {PopupService} from "../services/popUpService";
import {KeyCloakService} from "../services/keyCloakService";
import {AdminService} from "../services/adminService";



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../styles.css']
})
export class HeaderComponent {


  isMenuOpen = false;


  constructor(public popupService:PopupService, private router: Router, protected keyCloak:KeyCloakService, private adminService: AdminService){
  }
  goHomepage(){
    this.router.navigate(['']);
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


  changePage(event: Event,page:string) {
    if(page === "admin-area")
      this.adminService.section = 0
    this.router.navigate([page]);
    event.preventDefault();
  }

  goToAdminArea(event: Event, page:string, num: number){
    this.adminService.section = num;
    this.router.navigate([page]);
    event.preventDefault();
  }


}
