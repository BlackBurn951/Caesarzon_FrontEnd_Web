//DTO relativo ai dati di una richiesta di assistenza


export interface Supports {
  id: string;
  username: string
  type: string
  subject: string
  text: string
  dateRequest: string
  explain: string;
}
