import { Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {PopupService} from "../popUpService";
import {GetUserData} from "../getUserData";


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


  constructor(public popupService:PopupService, private router: Router, protected userData: GetUserData){
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


  changePage(event: Event,page:string) {
    this.router.navigate([page]);
    event.preventDefault();
  }


}
