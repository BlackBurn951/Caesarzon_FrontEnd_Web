import { Component, OnInit } from '@angular/core';
import { KeyCloakService } from "../services/keyCloakService";
import { CartService } from "../services/cartService";
import {ChangeCart} from "../entities/ChangeCart";
import {ProductService} from "../services/productService";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css', '../../styles.css']
})
export class ShoppingCartComponent implements OnInit {

  quantities: number[] = [1,2,3,4,5,6,7,8,9,10];
  sizes: string[] = ['XS','S', 'M', 'L', 'XL'];

  constructor(
    protected productService: ProductService,
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
      },
      error => {
        console.error('Errore nell\'aggiornamento della taglia', error);
      }
    );
  }

  ngOnInit(): void {
    this.cartService.cardId = ""
    this.cartService.addressId = ""
    this.cartService.selectedCardId = null
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    });
    this.cartService.getCart();
    this.productService.ricerca =""

  }


  salvaPerDopo(id: string) {
    const item = this.cartService.productInCart.find(product => product.id === id);
    if (item) {
      this.cartService.productInCart = this.cartService.productInCart.filter(product => product.id !== id);
      this.cartService.productLater.push(item);
      this.cartService.saveLater(id, 0)
    }
  }

  spostaNelCarrello(id: string) {
    const item = this.cartService.productLater.find(product => product.id === id);
    if (item) {
      this.cartService.productLater = this.cartService.productLater.filter(product => product.id !== id);
      this.cartService.productInCart.push(item);
      this.cartService.saveLater(id, 0)

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
