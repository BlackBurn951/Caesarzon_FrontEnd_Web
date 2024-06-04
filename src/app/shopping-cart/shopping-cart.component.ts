import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {PopupService} from "../services/popUpService";
import {KeyCloakService} from "../services/keyCloakService";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css', '../../styles.css']
})
export class ShoppingCartComponent {

  constructor(private router: Router, private popup: PopupService, private keyCloak: KeyCloakService) {
  }
  goToPayment() {
    if(this.keyCloak.getLoggedStatus()) {
      this.router.navigate(['payment-first-page'])
    }
    else {
      this.popup.openPopups(3, true);
    }
  }
}
