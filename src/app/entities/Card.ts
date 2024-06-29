//DTO per l'invio dei dati delle carte al server

export interface Card {
  cardNumber: string
  owner: string
  cvv: string
  expiryDate: Date
  balance: number
}
