import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {PersonalDataComponent} from "../personal-data/personal-data.component";
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-management-container',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './user-management-container.component.html',
  styleUrls: ['./user-management-container.component.css', '../../styles.css']
})
export class UserManagementContainerComponent {

  constructor(private router:Router) {

  }


  openPaymentData(event: Event) {
    this.router.navigate(['payment-data']);
    event.preventDefault()
  }

}