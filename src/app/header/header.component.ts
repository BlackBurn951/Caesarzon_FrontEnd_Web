import { Component } from '@angular/core';
import {LoginService} from "../loginService";
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

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

  constructor(public loginService: LoginService, private router: Router){

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

    protected readonly open = open;

  openPersonalData(event: Event) {
    this.router.navigate(['personal-data']);
    event.preventDefault()
  }
}
