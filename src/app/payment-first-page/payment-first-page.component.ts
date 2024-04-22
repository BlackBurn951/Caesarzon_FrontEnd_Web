import { Component } from '@angular/core';
import {GetUserData} from "../getUserData";
import {Router} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-payment-first-page',
  templateUrl: './payment-first-page.component.html',
  styleUrl: './payment-first-page.component.css'
})
export class PaymentFirstPageComponent {
  protected inputAbilitato: boolean | undefined;
  private testButton: string | undefined;
  testoButton!: string;

  constructor(protected getUserData: GetUserData, private router: Router) {

  }
  abilitaInput(): void{
    this.inputAbilitato = !this.inputAbilitato;
    this.testButton = this.inputAbilitato ? "Salva modifiche" : "Modifica";
  }

  goBackToCart() {
    this.router.navigate(['shopping-cart']);
  }

  proceed() {
    this.router.navigate(['payment-second-page']);
  }
}

