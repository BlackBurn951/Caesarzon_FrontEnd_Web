import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PopupService} from "../services/popUpService";
import {KeyCloakService} from "../services/keyCloakService";
import {CartService} from "../services/cartService";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css', '../../styles.css']
})
export class ShoppingCartComponent implements OnInit{

  constructor(private router: Router, private popup: PopupService, private keyCloak: KeyCloakService, protected cartService: CartService) {
  }


  goToPayment() {
    if(this.keyCloak.getLoggedStatus()) {
      this.router.navigate(['payment-first-page'])
    }
    else {
      this.popup.openPopups(3, true);
    }
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
    this.cartService.getCart()
  }

}
