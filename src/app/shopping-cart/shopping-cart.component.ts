import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css', '../../styles.css']
})
export class ShoppingCartComponent {
  private readonly isLogged:  boolean;

  constructor(private router: Router, private popup: PopupService) {
    this.isLogged=true;
  }
  goToPayment() {
    if(this.isLogged) {
      this.router.navigate(['payment-first-page'])
    }
    else {
      this.popup.openPopupLoginRegistration();
    }
  }
}
