import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {ProductSearch} from "../entities/ProductSearch";
import {ProductCart} from "../entities/ProductCart";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  getCartURL: string= 'http://localhost:8090/product-api/cart'

  productInCart: ProductCart[]= []

  constructor(private http: HttpClient, private keyCloakService: KeyCloakService) {
  }


  getCart() {
    const headers = this.keyCloakService.permaHeader();
    return this.http.get<ProductCart[]>(this.getCartURL, { headers}).subscribe(response => {
      if(response!=null) {
        this.productInCart= response
        console.log(this.productInCart)
      }
      console.log(response)
    });
  }
}
