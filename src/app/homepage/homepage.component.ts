import {Component, OnInit} from '@angular/core';
import {RegistrationComponent} from "../registration/registration.component";
import {MatDialog} from "@angular/material/dialog";
import {NavigationEnd, Router} from "@angular/router";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent{

  isMenuOpen = false;

  constructor(private dialog: MatDialog){

  }

  openPopup() {
    this.dialog.open(RegistrationComponent);
  }



  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


}
