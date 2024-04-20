import {Injectable, OnInit} from "@angular/core";
import { address } from "./utils/address";
import { user } from "./utils/user";
import { card } from "./utils/card";

@Injectable({
  providedIn: 'root',
})

export class GetUserData implements OnInit{

  user!: user;
  addresses!: address[];
  card!: card;

  inputAbilitato: boolean = false;
  testoButton: string = "Modifica";

  constructor() {
  }

  ngOnInit(): void {
    let user1!:user;
    this.user = new user(user1);
  }

  getUser(): void{

  }
  getAddresses(): void{

  }
  getCardInformation():void {

  }
}
