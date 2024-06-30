import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {Router} from "@angular/router";
import {AddressService} from "../services/addressService";

@Component({
  selector: 'app-payment-second-page',
  templateUrl: './payment-second-page.component.html',
  styleUrl: './payment-second-page.component.css'
})
export class PaymentSecondPageComponent {

  constructor(private addressService: AddressService, private router: Router) {
  }
  goBackToCart() {
    this.router.navigate(['shopping-cart']);
  }
}
