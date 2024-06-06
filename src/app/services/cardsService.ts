import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeyCloakService } from "./keyCloakService";
import { FormGroup } from "@angular/forms";
import { FormService } from "./formService";
import { Card } from "../entities/Card";
import {PopupService} from "./popUpService";
import {Router} from "@angular/router";
import {UserService} from "./userService";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  cartaCorrente!: Card;

  cardsName!: string[];

  formCaesarzon!: FormGroup;

  private getCardURL = 'http://localhost:8090/user-api/card';

  private getCardsNameURL = 'http://localhost:8090/user-api/cards-names';

  private sendCardURL = 'http://localhost:8090/user-api/card';

  constructor(private userService: UserService, private router: Router, private popUp: PopupService, private http: HttpClient, private keycloak: KeyCloakService, private formService: FormService) {
    this.formCaesarzon = formService.getForm();
  }

  getCards(nameLista: string): Observable<Card> {
    const urlWithParams = `${this.getCardURL}?nameLista=${nameLista}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.keycloak.getAccessToken()
    });
    return this.http.get<Card>(urlWithParams, { headers });
  }

  getCardsName() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.keycloak.getAccessToken()
    });
    this.http.get<string[]>(this.getCardsNameURL, { headers }).subscribe({
      next: (response) => {
        this.cardsName = response;

        if (this.cardsName.length > 0) {
          this.getCards(this.cardsName[0]).subscribe({
            next: (response: Card) => {
              this.userService.loading = false;
              this.cartaCorrente = response
              this.router.navigate(['payment-data']);
            },
            error: (error: any) => {
              if (error.status === 404) {
                this.userService.loading = false;
                this.router.navigate(['payment-data']);
              } else {
                this.userService.loading = false;
                console.error('Error fetching card:', error);
              }
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching address names:', error);
      }
    });
  }


  sendCard() {
    const indirizzoForm = this.formCaesarzon.get("formCarta");
    const numeroCarta = indirizzoForm?.get("numeroCarta")?.value;
    const titolareCarta = indirizzoForm?.get("titolareCarta")?.value;
    const dataScadenza = indirizzoForm?.get("dataScadenza")?.value;
    const cvv = indirizzoForm?.get("cvv")?.value;


    const cardData: Card = {
      cardNumber: numeroCarta,
      owner: titolareCarta,
      cvv: cvv,
      expiryDate: dataScadenza
    };

    this.sendCardData(cardData).subscribe(
      response => {
        this.popUp.closePopup()
        this.popUp.updateStringa("Carta aggiunta con successo!")
        this.popUp.openPopups(10, true)
        this.clearFields()
        window.location.reload()
      },
      error => {
        this.popUp.closePopup()
        this.popUp.updateStringa("Errore nell'aggiunta della carta!")
        this.popUp.openPopups(10, true)
        this.clearFields()
      }
    );
  }

  sendCardData(cardData: Card): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloak.getAccessToken() });
    return this.http.post(this.sendCardURL, cardData, { headers, responseType: 'text' }) as Observable<string>;
  }

  clearFields(){
    const formCarta = this.formCaesarzon.get('formCarta') as FormGroup;
    formCarta.patchValue({
      numeroCarta: '',
      titolareCarta: '',
      dataScadenza: '',
      cvv: '',

    });
  }
}
