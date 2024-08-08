import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import {PopupService} from "./popUpService";
import {ProductCart} from "../entities/ProductCart";
import {OrderDTO} from "../entities/OrderDTO";
import {CardsService} from "./cardsService";
import {AddressService} from "./addressService";
import {Card} from "../entities/Card";
import {Address} from "../entities/Address";
import {ChangeVisibility} from "../entities/ChangeVisibility";
import {Refund} from "../entities/Refund";

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  getOrdersURL: string = 'http://localhost:8090/product-api/orders';
  getProductsInOrderURL: string = 'http://localhost:8090/product-api/order/products/';
  refundOrderURL: string = 'http://localhost:8090/product-api/refund';

  orders!: OrderDTO[];
  refundOrders!: OrderDTO[];
  orderIndex!: number;

  orderId!: string;
  showProductsMapOrder: Record<string, boolean> = {};
  detailsShowMap: Record<string, boolean> = {};

  // Nuova struttura dati per memorizzare separatamente i dettagli per ogni ordine
  productsMap: Record<string, ProductCart[]> = {};
  orderDetailsMap: Record<string, { cartaOrdine?: Card, indirizzoOrdine?: Address }> = {};

  section: boolean = true;

  constructor(private addressService: AddressService, private cardService: CardsService, private http: HttpClient, private keyCloakService: KeyCloakService) {}

  getOrders() {
    const headers = this.keyCloakService.permaHeader();
    return this.http.get<OrderDTO[]>(this.getOrdersURL, { headers }).subscribe(response => {
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
      const customURL = this.getProductsInOrderURL + orderId;
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

    return this.http.put<string>(this.refundOrderURL, refund,{ headers,responseType: 'text' as 'json' })
  }


  changeSection() {
    this.section = !this.section
  }
}

