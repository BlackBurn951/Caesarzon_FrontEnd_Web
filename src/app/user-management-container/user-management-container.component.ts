import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Event, Router} from "@angular/router";
import {PopupService} from "../services/popUpService";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {UserService} from "../services/userService";
import {AddressService} from "../services/addressService";
import {CardsService} from "../services/cardsService";
import {User} from "../entities/User";
import {KeyCloakService} from "../services/keyCloakService";

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
export class UserManagementContainerComponent implements OnInit{

  constructor(protected keyCloak: KeyCloakService, private router:Router, public popUpService: PopupService, protected addressService: AddressService, private cardsService: CardsService, protected userService: UserService) {

  }

  openPersonalData() {
    this.router.navigate(['personal-data']);
  }

  openWishList() {
    this.router.navigate(['wish-list']);
  }

  openOrderSummary() {
    this.router.navigate(['order-summary']);
  }

  changePage(event: MouseEvent,page:string) {
    event.preventDefault()
    this.router.navigate([page]);
  }

  openPaymentData() {
    this.userService.loading = true;
    this.cardsService.getCardsName()
  }

  openAddressData() {
    this.userService.loading = true;
    this.addressService.getAddressesName()
  }

  openHelpRequest() {
    this.router.navigate(['help-request']);
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }

}
