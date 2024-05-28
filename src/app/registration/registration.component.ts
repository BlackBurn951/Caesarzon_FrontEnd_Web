import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormService} from "../services/formService";
import {PopupService} from "../services/popUpService";
import {KeyCloakService} from "../services/keyCloakService";
import {UserService} from "../services/userService";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css', '../../styles.css']

})
export class RegistrationComponent {

  protected formCaesarzon!: FormGroup;

  password! : string;
  username!: string;

  mostraPassword: { [key: string]: boolean } = { password: false, confermaPassword: false };

  passwordDifferenti: boolean = false;


  constructor(public formService: FormService, public popupService: PopupService, public keycloakService: KeyCloakService, private userService: UserService) {
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
    this.formService.setFormData(this.formCaesarzon.value);

    const email = this.formCaesarzon.get('formRegistrazione.email')?.value;
    const nome = this.formCaesarzon.get('formRegistrazione.nome')?.value;
    const cognome = this.formCaesarzon.get('formRegistrazione.cognome')?.value;
    const username = this.formCaesarzon.get('formRegistrazione.username')?.value;
    const password = this.formCaesarzon.get('formRegistrazione.password')?.value;

    this.userService.sendUser(username, email, nome, cognome, password)
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
