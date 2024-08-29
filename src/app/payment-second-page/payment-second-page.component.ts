import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AddressService} from "../services/addressService";
import {KeyCloakService} from "../services/keyCloakService";
import {User} from "../entities/User";
import {UserService} from "../services/userService";
import {CardsService} from "../services/cardsService";
import {CartService} from "../services/cartService";
import {PopupService} from "../services/popUpService";
import {ProductService} from "../services/productService";

@Component({
  selector: 'app-payment-second-page',
  templateUrl: './payment-second-page.component.html',
  styleUrls: ['./payment-second-page.component.css', '../../styles.css']
})
export class PaymentSecondPageComponent implements OnInit{

  constructor(private productService: ProductService, protected cartService: CartService, protected cardService: CardsService, private userService: UserService, protected addressService:AddressService, protected keyCloak: KeyCloakService, private router: Router, protected popUp: PopupService) {
  }

  goBackToCart() {
    this.router.navigate(['shopping-cart']);
  }

  pay() {
    if (this.cartService.addressId == "") {
      this.popUp.updateStringa("Seleziona un indirizzo di spedizione.");
      this.popUp.openPopups(123, true);
    } else if (this.cartService.cardId == "" && !this.cartService.payPal) {
      this.popUp.updateStringa("Seleziona un metodo di pagamento.");
      this.popUp.openPopups(123, true);
    } else {
      this.cartService.purchase();
    }
  }

  getRoundedDifference(): string {
    const difference = this.cartService.totaleSenzaSconto - this.cartService.totaleConSconto;
    return difference.toFixed(2);
  }

  getRoundedTotal(): string {
    const difference = this.cartService.totaleConSconto+5;
    return difference.toFixed(2);
  }

  ngOnInit(): void {
    this.productService.ricerca =""

    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
    this.keyCloak.loading = true
    this.userService.getUserData().subscribe(
      (userData: User) => {
        this.keyCloak.setNomeUtente(userData.firstName)
        this.keyCloak.setCognomeNomeUtente(userData.lastName)
        this.keyCloak.loading = false

      },
      error => {
        console.error('Error fetching user data:', error);
      }

    );
    this.keyCloak.loading = false
    this.addressService.getAddressesNamePayment()
    this.cardService.getCardsNamePayment()
    this.cartService.getCart()

  }

}
