//DTO relativo ai dati del prodotto da mostrare sulla pagine del prodottoù

import {AvailabilitiesSingle} from "./AvaibilitiesSingle";

export interface ProductDTO {
  id: string
  name: string
  description: string
  brand: string
  price: number
  discount: number
  primaryColor: string
  secondaryColor: string
  is_clothing: Boolean
  availabilities: AvailabilitiesSingle[]
  sport: string
  lastModified: string


}
