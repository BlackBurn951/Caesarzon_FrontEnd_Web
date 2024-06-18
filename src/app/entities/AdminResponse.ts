//DTO per l'invio della risposta dell'admin a segnalazioni e richieste di supporto

export interface AdminResponse {
  accept: boolean | null;
  explain: string | null;
}

