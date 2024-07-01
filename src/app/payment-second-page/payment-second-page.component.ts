import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AddressService} from "../services/addressService";
import {KeyCloakService} from "../services/keyCloakService";
import {User} from "../entities/User";
import {UserService} from "../services/userService";
import {CardsService} from "../services/cardsService";
import {CartService} from "../services/cartService";

@Component({
  selector: 'app-payment-second-page',
  templateUrl: './payment-second-page.component.html',
  styleUrl: './payment-second-page.component.css'
})
export class PaymentSecondPageComponent implements OnInit{

  constructor(protected cartService: CartService, protected cardService: CardsService, private userService: UserService, protected addressService:AddressService, protected keyCloak: KeyCloakService, private router: Router) {
  }

  goBackToCart() {
    this.router.navigate(['shopping-cart']);
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
    this.userService.getUserData().subscribe(
      (userData: User) => {
        this.keyCloak.setNomeUtente(userData.firstName)
        this.keyCloak.setCognomeNomeUtente(userData.lastName)

      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
    this.addressService.getAddressesNamePayment()
    this.cardService.getCardsNamePayment()
    this.cartService.getCart()

  }

}
