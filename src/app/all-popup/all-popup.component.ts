import {Component, OnInit} from '@angular/core';
import {PopupService} from "../services/popUpService";
import {ottieniCittaService} from "../services/ottieniCittaService";
import {AbstractControl, FormGroup} from "@angular/forms";
import {FormService} from "../services/formService";
import {AddressService} from "../services/addressService";
import {CardsService} from "../services/cardsService";
import {UserService} from "../services/userService";
import {BehaviorSubject, Subscription} from "rxjs";
import {AdminService} from "../services/adminService";
import {ProductService} from "../services/productService";
import {WishListService} from "../services/wishListService";
import {KeyCloakService} from "../services/keyCloakService";
import {FriendFollowerService} from "../services/friendFollowerService";
import {UserSearch} from "../entities/UserSearch";

@Component({
  selector: 'app-all-popup',
  templateUrl: './all-popup.component.html',
  styleUrls: ['./all-popup.component.css', '../../styles.css']
})
export class AllPopupComponent implements OnInit{

  section:number = 0
  sectionLabel:string = "Cerca utenti"

  rispostaAdminValida: boolean = false;

  //Creazione delle variabili base da utilizzare per inviare i dati al server

  newPassword: string = '';
  pass: string = '';
  confirmPassword: string = '';
  newPasswordError: string = '';
  confirmPasswordError: string = '';


  mostraPassword: { [key: string]: boolean } = { password: false, confermaPassword: false};


  formCaesarzon!: FormGroup;


  constructor(protected friendFollow: FriendFollowerService, private keyCloak: KeyCloakService, protected wishListService:WishListService, protected productService: ProductService, private addressService: AddressService, private cardService: CardsService, public popUpService:PopupService, protected ottieniCittaService: ottieniCittaService, protected formService: FormService, protected userService: UserService, protected adminService: AdminService){
    this.formCaesarzon= this.formService.getForm();
  }

  resetVariables(){
    this.newPassword = ''
    this.pass = ''
    this.confirmPassword = ''
    this.newPasswordError = ''
    this.confirmPasswordError = ''
    this.mostraPassword = {password: false, confermaPassword: false}
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
    this.friendFollow.salvaCambiamenti()
  }




  chiudiPopUpESalvaUtenti(){
    this.popUpService.closePopup()
    this.friendFollow.salvaCambiamenti()
  }

  isUserInFollow(user: UserSearch): boolean {
    if(this.friendFollow.usersFollow)
      return this.friendFollow.usersFollow.some(followedUser => followedUser.username === user.username);
    else
      return false
  }

  isUserInFriend(user: UserSearch): boolean {
    if(this.friendFollow.usersFriend && this.friendFollow.usersFriend.length > 0)
      return this.friendFollow.usersFriend.some(friendsUser => friendsUser.username === user.username);
    else{
      return false
    }
  }

  updateCodice(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.userService.codice[index] = inputElement.value;

    const spaziVuoti = this.userService.codice.filter(val => val === '').length;
    this.userService.lunghezzaCodice = spaziVuoti === 0;

    if (inputElement.value === '' && index > 0) {
      const prevIndex = index - 1;
      const prevInput = document.getElementById(`input${prevIndex}`) as HTMLInputElement | null;
      if (prevInput) {
        prevInput.focus();
      }
    } else {
      const nextIndex = index + 1;
      if (nextIndex < this.userService.codice.length) {
        const nextInput = document.getElementById(`input${nextIndex}`) as HTMLInputElement | null;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }


  ngOnInit(): void {
    this.resetVariables()
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }

  //Metodo che dopo aver validato al password chiama il server che effettuare il cambio
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
    this.userService.cambioPassword(this.newPassword);
    this.popUpService.updateStringa('Cambio password avvenuto con successo')
    this.popUpService.openPopups(141, true);

    this.confirmPasswordError = '';
    this.newPasswordError = '';
    this.popUpService.closePopup()


  }


  areAnyFieldsValid(): boolean {
    const formDisponibilita = this.formCaesarzon.get('formDisponibilita') as FormGroup;
    if (!formDisponibilita) {
      return false;
    }

    // Verifica se almeno uno dei campi di quantità è valido
    return Object.keys(formDisponibilita.controls).some(controlName => {
      const control = formDisponibilita.get(controlName) as AbstractControl;
      return control?.valid && control?.value !== null && control?.value !== '';
    });
  }


  //Metodo per l'eliminazione dell'account
  eliminaAccount(){
    this.userService.deleteUser()
  }

  rate(value: number) {
    this.productService.valutazioneRecensione = value;
  }

  //Metodi per la validazione dei campi
  isFormReportValid(): boolean {
    return !!this.adminService.descrizioneSegnalazione && this.adminService.descrizioneSegnalazione.length >= 5 && this.adminService.descrizioneSegnalazione.length <= 500;
  }

  isFormReviewValid(): boolean {
    return !!this.productService.descrizioneRecensione && this.productService.descrizioneRecensione.length >= 5 && this.productService.descrizioneRecensione.length <= 500 && this.productService.valutazioneRecensione > 0 && this.productService.valutazioneRecensione <=5 ;
  }

  checkValid() {
    this.rispostaAdminValida = this.adminService.rispostaAdmin.length >= 5 && this.adminService.rispostaAdmin.length <= 500;
  }


  sendReport(){
    if(this.isFormReportValid()) {
      this.adminService.sendReports()
    }
  }









}
