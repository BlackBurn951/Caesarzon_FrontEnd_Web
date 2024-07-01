import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import { ProductCart } from "../entities/ProductCart";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  getCartURL: string = 'http://localhost:8090/product-api/cart'

  productInCart!: ProductCart[];

  totaleSenzaSconto: number = 0;
  totaleConSconto: number = 0;

  constructor(private http: HttpClient, private keyCloakService: KeyCloakService) { }

  getCart() {
    const headers = this.keyCloakService.permaHeader();
    return this.http.get<ProductCart[]>(this.getCartURL, { headers }).subscribe(response => {
      if (response != null) {
        this.productInCart = response;
        console.log(this.productInCart);

        // Reset totals before calculating
        this.totaleSenzaSconto = 0;
        this.totaleConSconto = 0;

        this.productInCart.forEach(product => {
          this.totaleSenzaSconto += product.total;
          this.totaleConSconto += product.discountTotal;
        });
      }
      console.log(response);
      console.log('Totale senza sconto:', this.totaleSenzaSconto);
      console.log('Totale con sconto:', this.totaleConSconto);
    });
  }
}
