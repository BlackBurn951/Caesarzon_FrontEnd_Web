//DTO relativo ai dati di una segnalazione

import {AdminResponse} from "./AdminResponse";

export interface Reports {
  codice_segnalazione: string
  motivo: string
  descrizione: string
  dataSegnalazione: string;
  usernameUser2: string;

  adminResponse: AdminResponse

}
