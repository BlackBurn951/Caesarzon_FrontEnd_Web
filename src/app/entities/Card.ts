//DTO per l'invio dei dati delle carte al server

export interface Card {
  cardNumber: string | null
  owner: string | null
  cvv: string | null
  expiryDate: Date | null
}
