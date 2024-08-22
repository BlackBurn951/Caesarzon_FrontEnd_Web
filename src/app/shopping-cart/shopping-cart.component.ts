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
    this.cartService.checkAva().subscribe(res => {
      if(res === null) {
        this.router.navigate(['payment-second-page']);
      }else{
        this.popup.updateStringa("Sono cambiate le seguenti disponibilità")
        this.popup.openPopups(2343, true)
      }
    })
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
    this.cartService.getCart()
  }

}
