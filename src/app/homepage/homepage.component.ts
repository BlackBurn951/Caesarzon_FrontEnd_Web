import {Component, OnInit} from '@angular/core';
import {RegistrationComponent} from "../registration/registration.component";
import {MatDialog} from "@angular/material/dialog";
import {NavigationEnd, Router} from "@angular/router";
import {LoginService} from "../loginService";
import {ProductPageComponent} from "../product-page/product-page.component";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent{

  constructor(private router: Router) {
  }

  goToProductPage(event: Event) {
    this.router.navigate(['product-page'])
    event.preventDefault()
  }
}
