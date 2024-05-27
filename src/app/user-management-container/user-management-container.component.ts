import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";
import {PopupService} from "../services/popUpService";

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

  constructor(private router:Router, public popUpService: PopupService) {

  }

  openPersonalData(event: Event) {
    this.router.navigate(['personal-data']);
    event.preventDefault()
  }

  openWishList(event: Event) {
    this.router.navigate(['wish-list']);
    event.preventDefault()
  }
  openPaymentData(event: Event) {
    this.router.navigate(['payment-data']);
    event.preventDefault()
  }
  openAddressData(event: Event) {
    this.router.navigate(['address-data']);
    event.preventDefault()
  }

  openHelpRequest(event: Event) {
    this.router.navigate(['help-request']);
    event.preventDefault()
  }

}
