import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
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
  cardsMap: { [key: string]: string } = {};

  cards!: Card[];

  nomeCarta!: string;

  formCaesarzon!: FormGroup;

  private manageCardURL = 'http://localhost:8090/user-api/card';

  private getCardsNameURL = 'http://localhost:8090/user-api/cards';


  constructor(private userService: UserService, private router: Router, private popUp: PopupService, private http: HttpClient, private keyCloakService: KeyCloakService, private formService: FormService) {
    this.formCaesarzon = formService.getForm();
  }


  getCardsNamePayment() {
    const headers = this.keyCloakService.permaHeader();
    this.http.get<string[]>(this.getCardsNameURL, { headers }).subscribe({
      next: (response) => {
        console.log("Card ids: ", response);
        this.cardsName = response;

        // Creo un array di observable per ogni chiamata a getCards
        const requests = this.cardsName.map(cardName => this.getCards(cardName));

        // Utilizzo forkJoin per eseguire tutte le richieste in parallelo
        forkJoin(requests).subscribe(
          (cards: Card[]) => {
            console.log("Cards fetched:", cards);

            // Modifico il numero della carta per nascondere le prime 8 cifre
            cards.forEach(card => {
              const hiddenPart = card.cardNumber.slice(0, -8); // Prendo tutte le cifre tranne le ultime 4
              const visiblePart = card.cardNumber.slice(-4); // Prendo solo le ultime 4 cifre
              card.cardNumber = `${hiddenPart.replace(/\d/g, '*')}-${visiblePart}`;
            });

            this.cards = cards; // Assegno i dati delle carte all'array cards
          },
          (error) => {
            console.error('Error fetching cards:', error);
          }
        );
      },
      error: (error) => {
        console.error('Error fetching card names:', error);
      }
    });
  }


  deleteCard(){
    const urlWithParams = `${this.manageCardURL}?card_id=${this.nomeCarta}`;
    const headers = this.keyCloakService.permaHeader()

    this.http.delete<string>(urlWithParams, { headers , responseType: 'text' as 'json' })
      .subscribe({
        next: (response) => {
          console.log('Carta eliminato con successo:', response);
          this.popUp.updateStringa(response)
          this.popUp.openPopups(18, true)
          setTimeout(()=>{
            window.location.reload()

          }, 2000);

        },
        error: (error) => {
          console.error('Errore durante l\'eliminazione della\'carta', error);
        }
      });
  }


  getCards(idCard: string): Observable<Card> {
    const urlWithParams = `${this.manageCardURL}?card_id=${idCard}`;
    const headers = this.keyCloakService.permaHeader()
    return this.http.get<Card>(urlWithParams, { headers });
  }

  getCardsName() {
    const headers = this.keyCloakService.permaHeader()

    this.http.get<string[]>(this.getCardsNameURL, { headers }).subscribe({
      next: (response) => {
        this.cardsName = response;
        this.generateCardsMap();

        this.nomeCarta= this.cardsName[0];


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
        }else{
          this.userService.loading = false
          this.router.navigate(['payment-data']);

        }
      },
      error: (error) => {
        console.error('Error fetching address names:', error);
      }
    });
  }

  generateCardsMap() {
    this.cardsMap = {};
    this.cardsName.forEach((cardId, index) => {
      this.cardsMap[cardId] = `Carta ${index + 1}`;
    });
  }

  sendCard() {
    const indirizzoForm = this.formCaesarzon.get("formCarta");
    const numeroCarta = indirizzoForm?.get("numeroCarta")?.value;
    const titolareCarta = indirizzoForm?.get("titolareCarta")?.value;
    const dataScadenza = indirizzoForm?.get("dataScadenza")?.value;
    const cvv = indirizzoForm?.get("cvv")?.value;

    const numeroCartaFormattato = this.formatCardNumber(numeroCarta);

    console.log("numero carta: " + numeroCarta)
    console.log("numero carta formattato: " + numeroCartaFormattato)
    console.log("Titolare carta: " + titolareCarta)
    console.log("data: " + dataScadenza)
    console.log("cvv: " + cvv)

    const cardData: Card = {
      cardNumber: numeroCartaFormattato,
      owner: titolareCarta,
      cvv: cvv,
      expiryDate: dataScadenza,
      balance: 0
    };

    this.sendCardData(cardData).subscribe(
      response => {
        this.popUp.closePopup();
        this.popUp.updateStringa("Carta aggiunta con successo!");
        this.popUp.openPopups(144, true);
        this.clearFields();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error => {
        this.popUp.closePopup();
        this.popUp.updateStringa("Errore nell'aggiunta della carta!");
        this.popUp.openPopups(155, true);
        this.clearFields();
      }
    );
  }

  formatCardNumber(cardNumber: string): string {
    // Rimuove tutti i caratteri non numerici dalla stringa
    const numericString = cardNumber.replace(/\D/g, '');

    const formattedCardNumber = numericString.replace(/(.{4})/g, '$1-');

    return formattedCardNumber.slice(0, -1);
  }


  sendCardData(cardData: Card): Observable<string> {
    const headers = this.keyCloakService.permaHeader()
    return this.http.post(this.manageCardURL, cardData, { headers, responseType: 'text' }) as Observable<string>;
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
