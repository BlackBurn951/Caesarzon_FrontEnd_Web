//DTO relativo alle disponibilità del singolo prodotto

import {ProductDTO} from "./ProductDTO";

export interface Availabilities {
  amount: number
  size: string
  id: string
  product: ProductDTO | null
}
