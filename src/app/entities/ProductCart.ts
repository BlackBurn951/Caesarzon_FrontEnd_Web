//DTO inerente ai prodotti visualizzati nel carrello

export interface ProductCart {
  id: string
  total: number
  discountTotal: number
  quantity: number
  name: string
  size: string
}