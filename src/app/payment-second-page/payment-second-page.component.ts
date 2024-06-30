import {Component, OnInit} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {Router} from "@angular/router";
import {AddressService} from "../services/addressService";
import {KeyCloakService} from "../services/keyCloakService";

@Component({
  selector: 'app-payment-second-page',
  templateUrl: './payment-second-page.component.html',
  styleUrl: './payment-second-page.component.css'
})
export class PaymentSecondPageComponent implements OnInit{

  constructor(private keyCloak: KeyCloakService, private router: Router) {
  }
  goBackToCart() {
    this.router.navigate(['shopping-cart']);
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }
}
