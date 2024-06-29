import {Component, OnInit} from '@angular/core';
import {PopupService} from "../services/popUpService";
import {CardsService} from "../services/cardsService";
import {Card} from "../entities/Card";

@Component({
  selector: 'app-user-payment-data',
  templateUrl: './user-payment-data.component.html',
  styleUrls: ['./user-payment-data.component.css', '../../styles.css']
})
export class UserPaymentDataComponent implements OnInit{


  constructor(
    public popUpService: PopupService,
    protected cardService: CardsService,
  ) { }

  ngOnInit() {
    this.cardService.getCardsName()
  }

  loadCards(nameLista: string): void {
    this.cardService.getCards(nameLista).subscribe(
      (data: Card) => {
        this.cardService.cartaCorrente = data;
      },
      (error: any) => {
        console.error('Errore nel caricamento degli indirizzi', error);
      }
    );
  }
  deleteCard(){
    this.popUpService.operazione = 2
    this.popUpService.updateStringa("Sei sicuro di voler eliminare: " + this.cardService.cardsMap[this.cardService.nomeCarta] + "?")
    this.popUpService.openPopups(12, false);
  }



  onCardChange(event: Event): void {
    const selectedCard = (event.target as HTMLSelectElement).value;
    this.cardService.nomeCarta = selectedCard
    this.loadCards(selectedCard);

  }

}
