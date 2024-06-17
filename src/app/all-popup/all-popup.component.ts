import {Component, OnInit} from '@angular/core';
import {PopupService} from "../services/popUpService";
import {ottieniCittaService} from "../services/ottieni.citta.service";
import {FormGroup} from "@angular/forms";
import {FormService} from "../services/formService";
import {AddressService} from "../services/addressService";
import {CardsService} from "../services/cardsService";
import {UserService} from "../services/userService";
import {BehaviorSubject, Subscription} from "rxjs";

@Component({
  selector: 'app-all-popup',
  templateUrl: './all-popup.component.html',
  styleUrls: ['./all-popup.component.css', '../../styles.css']
})
export class AllPopupComponent{

  section:number = 0
  sectionLabel:string = "Cerca utenti"


  ratingSubject = new BehaviorSubject<number>(0);


  motivoSegnalazione!: string;
  descrizioneSegnalazione!: string;
  usernameSegnalato!: string;

  valutazione: number = 0;
  descrizioneRecensione!: string;


  newPassword: string = '';
  pass: string = '';
  confirmPassword: string = '';
  newPasswordError: string = '';
  confirmPasswordError: string = '';

  private ratingSubscription!: Subscription;

  mostraPassword: { [key: string]: boolean } = { password: false, confermaPassword: false };

  users = [
    { name: 'Mario Rossi', imgPath: 'path-to-image-1.jpg' },
    { name: 'Giulia Bianchi', imgPath: 'path-to-image-2.jpg' },
    { name: 'Luca Verdi', imgPath: 'path-to-image-3.jpg' }
  ];

  usersFollow = [
    { name: 'Anna Gialli', imgPath: 'path-to-image-4.jpg' },
    { name: 'Paolo Neri', imgPath: 'path-to-image-5.jpg' },
    { name: 'Sara Marroni', imgPath: 'path-to-image-6.jpg' }
  ];

  usersFriend = [
    { name: 'Giovanni Celesti', imgPath: 'path-to-image-7.jpg' },
    { name: 'Eleonora Rosa', imgPath: 'path-to-image-8.jpg' },
    { name: 'Marco Blu', imgPath: 'path-to-image-9.jpg' }
  ];

  formCaesarzon!: FormGroup;


  constructor(private addressService: AddressService, private cardService: CardsService, public popUpService:PopupService, protected ottieniCittaService: ottieniCittaService, protected formService: FormService, private userService: UserService){
    this.formCaesarzon= this.formService.getForm();

  }

  rate(rating: number) {
    this.ratingSubject.next(rating);
  }

  aggiungiIndirizzo(){
    this.addressService.sendAddress()
  }

  aggiungiCarta(){
    this.cardService.sendCard()
  }

  changeSection(numb: number, label: string) {
    this.section = numb
    this.sectionLabel = label;
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

  validatePassword(): void {
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$#%^&*()_+]).{8,16}$/;


    if (!passwordPattern.test(this.newPassword)) {
      this.newPasswordError = 'Formato incorretto: es. CiaoCiao69!'

      return;
    }


    if (this.confirmPassword.trim() === '') {
      this.confirmPasswordError = 'Si prega di confermare la password';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = 'Le password non corrispondono';
      return;
    }
    //this.utente.cambiaPassword(this.formService.username, this.newPassword);
    this.popUpService.updateStringa('Cambio password avvenuto con successo')
    this.popUpService.openPopups(10, true);

    this.confirmPasswordError = '';
    this.newPasswordError = '';
    this.popUpService.closePopup()


  }

  eliminaAccount(){
    this.userService.deleteUser()

  }

  isFormReportValid(): boolean {
    return !!this.descrizioneSegnalazione && this.descrizioneSegnalazione.length >= 5 && this.descrizioneSegnalazione.length <= 500;
  }

  isFormReviewValid(): boolean {
    return !!this.descrizioneRecensione && this.descrizioneRecensione.length >= 5 && this.descrizioneRecensione.length <= 500 && this.valutazione > 0 && this.valutazione <=5 ;
  }

  sendReview(){
    if(this.isFormReviewValid()){
      this.userService.sendReviews(this.valutazione, this.descrizioneRecensione)
    }
  }

  sendReport(){
    if(this.isFormReportValid()) {
      this.userService.sendReports(this.motivoSegnalazione, this.descrizioneSegnalazione, this.usernameSegnalato)
    }
  }

}
