import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormService} from "../formService";
import {PopupService} from "../popUpService";
import {GetUserData} from "../getUserData";
import {KeyCloakService} from "../KeyCloakService";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css', '../../styles.css']

})
export class RegistrationComponent {

  protected formCaesarzon!: FormGroup;

  password : string = "baby12345"
  username: string = "Cesare"

  mostraPassword: { [key: string]: boolean } = { password: false, confermaPassword: false };

  passwordDifferenti: boolean = false;


  constructor(public formService: FormService, public popupService: PopupService, protected userData: GetUserData, public keycloakService: KeyCloakService) {
    this.formCaesarzon = formService.getForm();
  }

  cambiaLarghezza(num: number) {
    const container = document.querySelector(".container-fluidos") as HTMLElement;
    if(num === 1){
      container.style.maxWidth = "56%";
    }else{
      container.style.maxWidth = "35%";
    }

  }

  registrati(){
    console.log("mi sono registrato")
  }

  comparaPassword() {
    const confermaPasswordValue = this.formCaesarzon.get('formRegistrazione.confermaPassword')?.value;
    const passwordValue = this.formCaesarzon.get('formRegistrazione.password')?.value;

    this.passwordDifferenti = confermaPasswordValue !== passwordValue;
  }


  togglePassword(fieldName: string) {
    const passwordField = document.getElementById(fieldName) as HTMLInputElement;
    this.mostraPassword[fieldName] = !this.mostraPassword[fieldName];

    if (this.mostraPassword[fieldName]) {
      passwordField.type = 'text';
    } else {
      passwordField.type = 'password';
    }
  }



}
