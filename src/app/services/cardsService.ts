import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeyCloakService } from "./keyCloakService";
import { FormGroup } from "@angular/forms";
import { FormService } from "./formService";
import { Card } from "../entities/Card";
import {PopupService} from "./popUpService";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  formCaesarzon!: FormGroup;

  private getCardsURL = 'http://localhost:8090/user-api/card';

  private sendCardURL = 'http://localhost:8090/user-api/card';

  constructor(private popUp: PopupService, private http: HttpClient, private keycloak: KeyCloakService, private formService: FormService) {
    this.formCaesarzon = formService.getForm();
  }

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.getCardsURL);
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
        this.popUp.openPopups(8, true)
        this.clearFields()
      },
      error => {
        this.popUp.closePopup()
        this.popUp.updateStringa("Errore nell'aggiunta della carta!")
        this.popUp.openPopups(8, true)
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
