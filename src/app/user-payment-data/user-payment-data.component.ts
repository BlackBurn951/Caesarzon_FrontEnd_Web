import { Component } from '@angular/core';
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {GetUserData} from "../getUserData";
import {FooterComponent} from "../footer/footer.component";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-user-payment-data',
  standalone: true,
  imports: [
    UserManagementContainerComponent,
    FooterComponent
  ],
  templateUrl: './user-payment-data.component.html',
  styleUrls: ['./user-payment-data.component.css', '../../styles.css']
})
export class UserPaymentDataComponent {

  inputAbilitato: boolean = false;

  testoButton: string = "Modifica";

  constructor(public getUserData:GetUserData, public popUpService:PopupService) {
  }

  abilitaInput(): void{
    this.inputAbilitato = !this.inputAbilitato;
    this.testoButton = this.inputAbilitato ? "Salva modifiche" : "Modifica";
  }

}
