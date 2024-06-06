import {City} from "./City";

export interface Address {
  id: number | null;
  roadName: string | null;
  houseNumber: string | null;
  roadType: string | null;
  city: City | null;
}


