import {Injectable, OnInit} from "@angular/core";
import { address } from "./utils/address";
import { user } from "./utils/user";
import { card } from "./utils/card";

@Injectable({
  providedIn: 'root',
})

export class GetUserData implements OnInit{

  isLogged = false;

  user!: user;
  addresses!: address[];
  card!: card;

  inputAbilitato: boolean = false;
  testoButton: string = "Modifica";

  constructor() {
  }

  ngOnInit(): void {
  }

  getUser(): void{

  }
  getAddresses(): void{

  }
  getCardInformation():void {

}
}