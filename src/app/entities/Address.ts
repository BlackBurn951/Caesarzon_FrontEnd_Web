import {City} from "./City";

export interface Address {
  id: number | null;
  roadName: string;
  houseNumber: string;
  roadType: string;
  city: City;
}


