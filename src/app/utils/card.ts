export interface card {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  cvv: string;
}

export class Card {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  cvv: string;

  constructor( data: card) {
    this.cardNumber = data.cardNumber;
    this.cardHolderName = data.cardHolderName;
    this.expirationDate = data.expirationDate;
    this.cvv = data.cvv;
  }
}
