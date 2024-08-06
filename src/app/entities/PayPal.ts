import {Buy} from "./Buy";

export interface PayPal{
  paymentId: string,
  token: string,
  payerId: string
  buyDTO: Buy
}
