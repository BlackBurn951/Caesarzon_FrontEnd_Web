import {City} from "./City";

//DTO per l'invio dei dati dell'indirizzo al server, contenente al suo interno un altro DTO della città

export interface Address {
  id: number | null;
  roadName: string | null;
  houseNumber: string | null;
  roadType: string | null;
  city: City | null;
}


