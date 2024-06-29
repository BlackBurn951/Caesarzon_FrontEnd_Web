//DTO relativo alle recensioni di un prodotto

export interface ProductReview{
  id: string
  text: string
  evaluation: number
  username: string
  productID: string
  date: string
}
