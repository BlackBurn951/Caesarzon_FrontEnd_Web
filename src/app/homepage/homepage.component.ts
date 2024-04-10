import {Component} from '@angular/core';
import {RegistrationComponent} from "../registration/registration.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  isMenuOpen = false;

  constructor(private dialog: MatDialog){

  }

  openRegistration(event: MouseEvent) {
    event.preventDefault();
    this.dialog.open(RegistrationComponent, {
    });
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


}
