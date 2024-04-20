import { Component } from '@angular/core';
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";

@Component({
  selector: 'app-user-payment-data',
  standalone: true,
    imports: [
        UserManagementContainerComponent
    ],
  templateUrl: './user-payment-data.component.html',
  styleUrl: './user-payment-data.component.css'
})
export class UserPaymentDataComponent {

}
