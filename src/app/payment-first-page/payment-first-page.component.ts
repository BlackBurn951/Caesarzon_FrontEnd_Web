import { Component } from '@angular/core';
import {GetUserData} from "../getUserData";

@Component({
  selector: 'app-payment-first-page',
  templateUrl: './payment-first-page.component.html',
  styleUrl: './payment-first-page.component.css'
})
export class PaymentFirstPageComponent {

  constructor(protected getUserData: GetUserData) {
  }

}
