import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {GetUserData} from "../getUserData";

@Component({
  selector: 'app-user-address-data',
  standalone: true,
    imports: [
        FooterComponent,
        UserManagementContainerComponent
    ],
  templateUrl: './user-address-data.component.html',
  styleUrl: './user-address-data.component.css'
})
export class UserAddressDataComponent {

  inputAbilitato: boolean = false;

  testoButton: string = "Modifica";

  constructor(public getUserData:GetUserData) {
  }

  abilitaInput(): void{
    this.inputAbilitato = !this.inputAbilitato;
    this.testoButton = this.inputAbilitato ? "Salva modifiche" : "Modifica";
  }
}
