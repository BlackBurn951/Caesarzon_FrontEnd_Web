import { Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {PopupService} from "../popUpService";
import {GetUserData} from "../getUserData";

// @ts-ignore
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
  showSportsDropdown: boolean = false;
  showMusicDropdown: boolean = false;

  constructor(public popupService:PopupService, private router: Router, public userData: GetUserData){

  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /*goToProductManagement() {
    this.router.navigate(['product-managment']);
  }*/




  changePage(event: Event,page:string) {
    this.router.navigate([page]);
    event.preventDefault();
  }

  openAdminArea(event: Event) {
    this.router.navigate(['admin-area']);
    event.preventDefault()
  }

  openProfileArea(event: Event) {
    this.router.navigate(['personal-data']);
    event.preventDefault()
  }



}
