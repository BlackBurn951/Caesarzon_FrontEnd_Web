import { Component } from '@angular/core';
import {GetUserData} from "../getUserData";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {FormService} from "../services/formService";

@Component({
  selector: 'app-payment-first-page',
  templateUrl: './payment-first-page.component.html',
  styleUrl: './payment-first-page.component.css'
})
export class PaymentFirstPageComponent {
  protected inputAbilitato: boolean | undefined;
  private testButton: string | undefined;
  testoButton!: string;
  protected formCaesarzone!: FormGroup;
  protected abilitator!: boolean;

  constructor(protected getUserData: GetUserData, private router: Router, private formService: FormService) {
    this.formCaesarzone=formService.getForm();
    this.abilitator=false;
  }

  abilitaInput(): void{
    this.inputAbilitato = !this.inputAbilitato;
    this.testButton = this.inputAbilitato ? "Salva modifiche" : "Modifica";
  }

  goBackToCart() {
    this.router.navigate(['shopping-cart']);
  }

  proceed() {
    if(this.formService)
    this.router.navigate(['payment-second-page']);
  }
}

