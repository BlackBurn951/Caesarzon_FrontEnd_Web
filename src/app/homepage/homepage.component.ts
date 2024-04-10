import { Component } from '@angular/core';
import {RegistrationComponent} from "../registration/registration.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  constructor(private dialog: MatDialog){

  }
  openRegistration() {
    this.dialog.open(RegistrationComponent, {
    });
  }
}
