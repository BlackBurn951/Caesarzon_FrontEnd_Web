import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../styles.css']
})
export class HeaderComponent {

  isMenuOpen = false;

  constructor(public popupService:PopupService, private router: Router){

  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToProductManagement() {
    this.router.navigate(['product-management']);
  }

  goToShoppingCart() {
    this.router.navigate(['shopping-cart'])
  }
}
