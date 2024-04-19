import { Component } from '@angular/core';
import {LoginService} from "../loginService";
import {NgIf} from "@angular/common";
import {FormGroup} from "@angular/forms";
import {FormService} from "../formService";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css', '../../styles.css']

})
export class RegistrationComponent {

  protected formCaesarzon!: FormGroup;

  passwordDifferenti: boolean = false;



  constructor(public formService: FormService, public loginService: LoginService) {
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


}
