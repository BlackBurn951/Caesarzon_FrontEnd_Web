import {Component, OnInit} from '@angular/core';
import {RegistrationComponent} from "../registration/registration.component";
import {MatDialog} from "@angular/material/dialog";
import {NavigationEnd, Router} from "@angular/router";
import {LoginService} from "../loginService";
import {ProductPageComponent} from "../product-page/product-page.component";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent{

  isMenuOpen = false;

  constructor(public loginService: LoginService, private router: Router) {
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


  goToProductPage(event: Event) {
    this.router.navigate(['product-page'])
    event.preventDefault()
  }
}
