//DTO relativo ai dati di una richiesta di assistenza

import {AdminResponse} from "./AdminResponse";

export interface Supports {
  username: string
  codice_supporto: string
  motivo: string
  oggetto: string
  descrizione: string
  dataRichiesta: string

  adminResponse: AdminResponse
}
