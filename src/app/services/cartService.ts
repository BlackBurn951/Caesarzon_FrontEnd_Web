import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import { ProductCart } from "../entities/ProductCart";
import {Unvailable} from "../entities/Unvaiable";
import {Buy} from "../entities/Buy";
import {ActivatedRoute, Router} from "@angular/router";
import {SendProductOrderDTO} from "../entities/SendProductToCart";
import {PopupService} from "./popUpService";
import {PayPal} from "../entities/PayPal";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  getCartURL: string = 'http://localhost:8090/product-api/cart'

  checkAvaURL: string = 'http://localhost:8090/product-api/pre-order';

  doOrderURL: string = 'http://localhost:8090/product-api/purchase';

  doSuccesURL: string = 'http://localhost:8090/product-api/success';

  ordineInviato!: boolean;

  productInCart!: ProductCart[];


  unvaiable!: Unvailable[]

  productIds: string[] = []

  payPal: boolean = false;

  cardId: string = ""
  addressId: string = ""


  totaleSenzaSconto: number = 0;
  totaleConSconto: number = 0;


  productIdToAddCart: string = ""
  size: string = "";
  quantity: number = 1;

  constructor(private route: ActivatedRoute, private popUp: PopupService, private router:Router, private http: HttpClient, private keyCloakService: KeyCloakService) { }

  addProductCart(){

    const productToAddCart: SendProductOrderDTO ={
      productID: this.productIdToAddCart,
      size: this.size,
      quantity: this.quantity
    }

    const headers = this.keyCloakService.permaHeader();
    return this.http.post<string>(this.getCartURL, productToAddCart,{headers, responseType: 'text' as 'json'}).subscribe(response => {
      console.log("risposta ggiunta: " + response)
      if(response == "Ordine creato con successo!"){
        this.popUp.updateStringa("Prodotto aggiunto al carrello")
        this.popUp.openPopups(45, true)
        this.size = ""
        this.quantity = 1
        this.productIdToAddCart = ""
        setTimeout(() => {
          this.popUp.closePopup()
        }, 1000);
      }else{
        this.size = ""
        this.quantity = 1
        this.productIdToAddCart = ""
        this.popUp.updateStringa("Errore nell'aggiunta del prodotto al carrello")
        this.popUp.openPopups(45, true)
        setTimeout(() => {
          this.popUp.closePopup()
        }, 1000);
      }
    })
  }

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
  selectedCardId: string | null = null;

  changePay(){
    this.selectedCardId = null;
    this.payPal = true;
  }

  checkAva(){
    this.productInCart.forEach(a =>{
      this.productIds.push(a.id)
      console.log(a.id);
    })
    const headers = this.keyCloakService.permaHeader();
    return this.http.post<Unvailable[]>(this.checkAvaURL, this.productIds,{headers});
  }

  doSuccess() {
    const buy: Buy = {
      addressID: this.addressId,
      cardID: this.cardId,
      productsIds: this.productIds,
      total: this.totaleConSconto + 5
    };

    this.route.queryParamMap.subscribe(params => {
      const paymentId = params.get('paymentId');
      const token = params.get('token');
      const payerId = params.get('payerId');

      const pay: PayPal = {
        paymentId: paymentId!,
        token: token!,
        payerId: payerId!,
        buyDTO: buy
      };

      console.log('PayPal details:', pay);
    });
  }


  takeCardId(cardId: string){
    this.cardId = cardId;
    this.selectedCardId = cardId;
    this.payPal = false;
  }

  purchase(){
    const buy :Buy ={
      addressID: this.addressId,
      cardID: this.cardId,
      productsIds : this.productIds,
      total: 0
    }
    console.log("PAYPAL ABILITATO?: " + this.payPal)
    const custmUrl = this.doOrderURL+"?pay-method="+this.payPal
    const headers = this.keyCloakService.permaHeader();
    return this.http.post<string>(custmUrl, buy,{headers, responseType: 'text' as 'json'}).subscribe(response => {
      if(response === "Errore...") {
        this.popUp.updateStringa("ERRORE ALDOS")
        this.popUp.openPopups(45, true)
      }else{
        if(response === "Ordine effettuato con successo!"){
          this.ordineInviato = true
          this.router.navigate(['order-final']);
        }
      }
    })
  }




  takeAddressId(addressId: string){
    this.addressId = addressId
  }
}
