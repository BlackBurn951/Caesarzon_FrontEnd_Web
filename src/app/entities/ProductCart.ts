//DTO inerente ai prodotti visualizzati nel carrello

import {SafeUrl} from "@angular/platform-browser";

export interface ProductCart {
  id: string
  total: number
  discountTotal: number
  quantity: number
  name: string
  size: string
  buyLater: boolean
  image: SafeUrl


}
