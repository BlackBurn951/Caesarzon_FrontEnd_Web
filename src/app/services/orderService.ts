import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {ProductCart} from "../entities/ProductCart";
import {OrderDTO} from "../entities/OrderDTO";
import {CardsService} from "./cardsService";
import {AddressService} from "./addressService";
import {Card} from "../entities/Card";
import {Address} from "../entities/Address";
import {Refund} from "../entities/Refund";
import {UserService} from "./userService";

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  getOrdersURL: string = 'http://localhost:8090/product-api/orders';
  getProductsInOrderURL: string = 'http://localhost:8090/product-api/order/products/';
  refundOrderURL: string = 'http://localhost:8090/product-api/refund';

  orders: OrderDTO[] = [];
  refundOrders: OrderDTO[] = [];
  orderIndex!: number;

  orderId!: string;
  showProductsMapOrder: Record<string, boolean> = {};
  detailsShowMap: Record<string, boolean> = {};

  // Nuova struttura dati per memorizzare separatamente i dettagli per ogni ordine
  productsMap: Record<string, ProductCart[]> = {};
  orderDetailsMap: Record<string, { cartaOrdine?: Card, indirizzoOrdine?: Address }> = {};

  section: boolean = true;

  constructor(private userService: UserService, private addressService: AddressService, private cardService: CardsService, private http: HttpClient, private keyCloakService: KeyCloakService) {}

  getOrders() {
    const headers = this.keyCloakService.permaHeader();
    return this.http.get<OrderDTO[]>(this.getOrdersURL, { headers }).subscribe(response => {
      if (response != null) {
        this.orders = response.filter(order => !order.refund);
        this.refundOrders = response.filter(order => order.refund);
      }
    });
  }

  getOrdersByAdmin() {
    const headers = this.keyCloakService.permaHeader();
    const customURL = this.getOrdersURL+'/'+this.userService.username
    return this.http.get<OrderDTO[]>(customURL, { headers }).subscribe(response => {
      if (response != null) {
        this.orders = response.filter(order => !order.refund);
        this.refundOrders = response.filter(order => order.refund);
      }
    });
  }



  getProductsInOder(orderId: string) {
    this.showProductsMapOrder[orderId] = !this.showProductsMapOrder[orderId];

    if (this.showProductsMapOrder[orderId] && !this.productsMap[orderId]) {
      const headers = this.keyCloakService.permaHeader();
      let customURL = ''
      if(this.keyCloakService.getAdmin()){
        customURL = this.getProductsInOrderURL + orderId + '/' + this.userService.username
      }else{
        customURL = this.getProductsInOrderURL + orderId
      }
      this.http.get<ProductCart[]>(customURL, { headers }).subscribe(response => {
        if (response != null) {
          this.productsMap[orderId] = response;
        }
      });
    }
  }


  mostraDettagliOrdine(cardId: string, addresId: string, orderId: string) {
    if (!this.detailsShowMap[orderId]) {
      if (!this.orderDetailsMap[orderId]) {
        this.orderDetailsMap[orderId] = {};

        this.addressService.getAddress(addresId).subscribe((data: Address) => {
          this.orderDetailsMap[orderId].indirizzoOrdine = data;
        });

        if (cardId != null) {
          this.cardService.getCards(cardId).subscribe((data: Card) => {
            const cardNumber = data.cardNumber;
            const maskedCardNumber = cardNumber.slice(0, -4).replace(/./g, '*') + cardNumber.slice(-4);
            this.orderDetailsMap[orderId].cartaOrdine = { ...data, cardNumber: maskedCardNumber };
          });
        }
      }
    }
    this.detailsShowMap[orderId] = !this.detailsShowMap[orderId];
  }

  richiediReso(){
    const headers = this.keyCloakService.permaHeader();

    const refund: Refund = {
      purchaseId: this.orderId
    }

    const customURL = this.refundOrderURL+'/'+this.userService.username

    if(this.keyCloakService.getAdmin()){
      return this.http.put<string>(customURL, refund,{ headers,responseType: 'text' as 'json' })
    }else{
      return this.http.put<string>(this.refundOrderURL, refund,{ headers,responseType: 'text' as 'json' })

    }

  }

  sectionN: number = 0

  changeSection(num: number) {
    this.section = !this.section
    this.sectionN = num
  }
}

