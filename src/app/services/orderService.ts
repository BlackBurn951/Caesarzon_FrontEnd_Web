import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {PopupService} from "./popUpService";
import {ProductCart} from "../entities/ProductCart";
import {OrderDTO} from "../entities/OrderDTO";

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  getOrdersURL: string = 'http://localhost:8090/product-api/orders'

  getProductsInOrderURL: string = 'http://localhost:8090/product-api/order/products/';

  productInOrder!: ProductCart[];

  orders!: OrderDTO[];

  showProductsMapOrder: Record<string, boolean> = {};


  constructor(private popUp: PopupService, private http: HttpClient, private keyCloakService: KeyCloakService) {

  }

  getOrders(){
    const headers = this.keyCloakService.permaHeader();
    return this.http.get<OrderDTO[]>(this.getOrdersURL, { headers }).subscribe(response => {
      if (response != null) {
        this.orders = response;
      }
    });
  }


  getProductsInOder(orderId: string){
    this.showProductsMapOrder[orderId] = !this.showProductsMapOrder[orderId];
    if (this.showProductsMapOrder[orderId]){
      const headers = this.keyCloakService.permaHeader();
      const customURL = this.getProductsInOrderURL+orderId
      this.http.get<ProductCart[]>(customURL, { headers, responseType: 'text' as 'json'}).subscribe(response => {
        if (response != null) {
          this.productInOrder = response;
        }
      });
    }
  }

}
