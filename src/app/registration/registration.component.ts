import {Component, OnInit} from '@angular/core';
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

export class RegistrationComponent implements OnInit{

  protected formCaesarzon!: FormGroup;

  password : string = ''

  mostraPassword: { [key: string]: boolean } = { password: false, confermaPassword: false };

  passwordDifferenti: boolean = false;

  constructor(public formService: FormService, public popupService: PopupService, public keycloakService: KeyCloakService, protected userService: UserService) {
    this.formCaesarzon = formService.getForm();
  }

  ngOnInit(): void {
    this.password = ''
    this.keycloakService.getNotify().subscribe(notifies => {
      this.keycloakService.notifications = notifies;
    })
  }

  //Metodo per modificare la grandezza del popUp a seconda se si è nel login o nella registrazione di un nuovo utente
  cambiaLarghezza(num: number) {
    const container = document.querySelector(".container-fluidos") as HTMLElement;
    if(num === 1){
      container.style.maxWidth = "56%";
    }else{
      container.style.maxWidth = "35%";
    }

  }

  //Metodo per salvare i dati appena immessi dall'utente e mandarli al server per effettuare la registrazione
  registrati(){
    this.formService.setFormData(this.formCaesarzon.value);

    const email = this.formCaesarzon.get('formRegistrazione.email')?.value;
    const nome = this.formCaesarzon.get('formRegistrazione.nome')?.value;
    const cognome = this.formCaesarzon.get('formRegistrazione.cognome')?.value;
    const username = this.formCaesarzon.get('formRegistrazione.username')?.value;
    const password = this.formCaesarzon.get('formRegistrazione.password')?.value;

    this.userService.sendUser(username, email, nome, cognome, password)
  }

  //Metodo per comparare la password e la conferma della stessa
  comparaPassword() {
    const confermaPasswordValue = this.formCaesarzon.get('formRegistrazione.confermaPassword')?.value;
    const passwordValue = this.formCaesarzon.get('formRegistrazione.password')?.value;

    this.passwordDifferenti = confermaPasswordValue !== passwordValue;
  }

  //Metodo per cambiare la visibilità del campo relativo alla password
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
