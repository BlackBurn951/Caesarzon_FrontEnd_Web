export interface OrderDTO {
  id: string
  orderNumber: string
  orderState: string
  expectedDeliveryDate: string
  purchaseDate: string
  refundDate: string
  refund: boolean
  addressID: string
  cardID: string
  orderTotal: number
  username: string
}
