import { Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {PopupService} from "../services/popUpService";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {UserService} from "../services/userService";
import {AddressService} from "../services/addressService";
import {CardsService} from "../services/cardsService";
import {User} from "../entities/User";

@Component({
  selector: 'app-user-management-container',
  standalone: true,
  imports: [
    NgClass,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './user-management-container.component.html',
  styleUrls: ['./user-management-container.component.css', '../../styles.css']
})
export class UserManagementContainerComponent {

  constructor(private router:Router, public popUpService: PopupService, protected addressService: AddressService, private cardsService: CardsService, protected userService: UserService) {

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
    this.userService.loading = true;
    this.cardsService.getCardsName()
  }

  openAddressData() {
    this.userService.loading = true;
    this.addressService.getAddressesName()
  }

  openHelpRequest(event: Event) {
    this.router.navigate(['help-request']);
    event.preventDefault()
  }

}
