//DTO relativo ai dati di un ban

export interface Bans {
  reason: string;
  startDate: string;
  endDate: string;
  userUsername: string;
  adminUsername: string;
  confirmed: boolean;

}
