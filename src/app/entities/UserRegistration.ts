//DTO relativo ai dati di un utente in fase di registrazione

export interface UserRegistration {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  credentialValue: string;
}
