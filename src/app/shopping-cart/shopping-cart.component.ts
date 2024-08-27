import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { PopupService } from "../services/popUpService";
import { KeyCloakService } from "../services/keyCloakService";
import { CartService } from "../services/cartService";
import {ChangeCart} from "../entities/ChangeCart";
import {Unvailable} from "../entities/Unvaiable";
import {Availabilities} from "../entities/Availabilities";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css', '../../styles.css']
})
export class ShoppingCartComponent implements OnInit {

  quantities: number[] = [1,2,3,4,5,6,7,8,9,10];
  sizes: string[] = ['XS','S', 'M', 'L', 'XL'];

  constructor(
    private router: Router,
    private popup: PopupService,
    private keyCloak: KeyCloakService,
    public cartService: CartService
  ) { }


  onQuantityChange(item: any) {
    const changeCartDTO: ChangeCart = {
      quantity: item.quantity,
      size: item.size
    };

    this.cartService.updateProductInCart(item.id, 1, changeCartDTO).subscribe(
      response => {
        console.log('Quantità aggiornata con successo', response);
      },
      error => {
        console.error('Errore nell\'aggiornamento della quantità', error);
      }
    );
  }

  onSizeChange(item: any) {
    const changeCartDTO: ChangeCart = {
      quantity: item.quantity,
      size: item.size
    };

    this.cartService.updateProductInCart(item.id, 1, changeCartDTO).subscribe(
      response => {
        console.log('Taglia aggiornata con successo', response);
      },
      error => {
        console.error('Errore nell\'aggiornamento della taglia', error);
      }
    );
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    });
    this.cartService.getCart();
  }

  goToPayment() {
    this.cartService.checkAva().subscribe(res => {
      if (res === null) {
        this.router.navigate(['payment-second-page']);
      } else {
        this.cartService.unvaiable = res;

        let availabilityMessage = "Sono cambiate le seguenti disponibilità:\n";

        res.forEach((item: Unvailable) => {
          availabilityMessage += `\nProdotto: ${item.name}\n`;
          item.availability.forEach((avail: Availabilities) => {
            availabilityMessage += `  - Taglia: ${avail.size}, Disponibilità: ${avail.amount}\n`;
          });
        });

        this.popup.updateStringa(availabilityMessage);
        this.popup.openPopups(2343, true);
      }
    });
  }


  salvaPerDopo(id: string) {
    const item = this.cartService.productInCart.find(product => product.id === id);
    if (item) {
      this.cartService.productInCart = this.cartService.productInCart.filter(product => product.id !== id);
      this.cartService.productLater.push(item);
      this.cartService.saveLater(id)
    }
  }

  spostaNelCarrello(id: string) {
    const item = this.cartService.productLater.find(product => product.id === id);
    if (item) {
      this.cartService.productLater = this.cartService.productLater.filter(product => product.id !== id);
      this.cartService.productInCart.push(item);
      this.cartService.putInCart(item.size, item.quantity, item.id);

    }
  }

  rimuoviDalCarrello(id: string) {
    const item = this.cartService.productInCart.find(product => product.id === id);
    if(item){
      this.cartService.productInCart = this.cartService.productInCart.filter(product => product.id !== id);
      this.cartService.removeFromCart(id)
    }
  }

  rimuoviDaSalvati(id: string) {
    const item = this.cartService.productLater.find(product => product.id === id);
    if(item){
      this.cartService.productLater = this.cartService.productLater.filter(product => product.id !== id);
      this.cartService.removeFromCart(item.id)
    }
  }

  getTotalPrice(): number {
    return this.cartService.productInCart.reduce((total, product) => total + (product.total * product.quantity), 0);
  }
}
