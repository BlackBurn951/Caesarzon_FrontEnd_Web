import {Injectable, OnInit} from "@angular/core";
import { address } from "./utils/address";
import { user } from "./utils/user";
import { card } from "./utils/card";
import {Event} from "@angular/router";
import {PopupService} from "./popUpService";

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

  constructor(private popupS: PopupService) {
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

  toggleLogin(event: MouseEvent) {
    this.isLogged = !this.isLogged;
    this.popupS.closePopup();
    event.preventDefault()
  }
}
