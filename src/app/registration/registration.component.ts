import { Component } from '@angular/core';
import {LoginService} from "../loginService";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css', '../../styles.css']

})
export class RegistrationComponent {

  constructor(public loginService: LoginService) {
  }


}
