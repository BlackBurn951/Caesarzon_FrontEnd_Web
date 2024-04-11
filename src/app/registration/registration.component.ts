import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoginService} from "../loginService";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  constructor(public loginService: LoginService) {
  }


}
