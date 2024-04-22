import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-second-page',
  templateUrl: './payment-second-page.component.html',
  styleUrl: './payment-second-page.component.css'
})
export class PaymentSecondPageComponent {

  constructor(private router: Router) {
  }
  goBackToCart() {
    this.router.navigate(['shopping-cart']);
  }
}
