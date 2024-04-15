import {Component, OnInit} from '@angular/core';
import {RegistrationComponent} from "../registration/registration.component";
import {MatDialog} from "@angular/material/dialog";
import {NavigationEnd, Router} from "@angular/router";
import {LoginService} from "../loginService";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent{

  isMenuOpen = false;

  constructor(public loginService: LoginService) {
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


}
