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
  selectedCardId: string | null = null;

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
        this.totaleSenzaSconto = 0;
        this.totaleConSconto = 0;

        this.productInCart.forEach(product => {
          this.totaleSenzaSconto += product.total;
          this.totaleConSconto += product.discountTotal;
        });
      }
    });
  }

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


  buy!: Buy;

  doSuccess() {
    this.route.queryParamMap.subscribe(params => {
      const paymentId = params.get('paymentId');
      const token = params.get('token');
      const payerId = params.get('PayerID');

      if (!paymentId || !token || !payerId) {
        console.error('Missing payment parameters');
        return;
      }

      // Retrieve this.buy from session storage
      const buyData = sessionStorage.getItem('buy');
      if (buyData) {
        this.buy = JSON.parse(buyData);
      } else {
        console.error('No buy data found in session storage');
        return;
      }

      console.log("NEL DO SUCCESS")
      console.log("ADDRESS ID: " + this.buy.addressID)
      console.log("CARD ID: " + this.buy.cardID)
      this.buy.productsIds.forEach(productId => {console.log("PRODUCTID: " + productId)})
      console.log("TOTALE: " + this.buy.total)

      const pay: PayPal = {
        paymentId: paymentId,
        token: token,
        payerId: payerId,
        buyDTO: this.buy
      };

      console.log('PayPal details:', pay);

      const headers = this.keyCloakService.permaHeader();
      this.http.post<string>(this.doSuccesURL, pay, { headers }).subscribe(response => {
        console.log('Success response:', response);
        this.ordineInviato = response !== "Errore...";
      }, error => {
        // Handle HTTP error
        console.error('HTTP error:', error);
      });
    });
  }



  takeCardId(cardId: string){
    this.cardId = cardId;
    this.selectedCardId = cardId;
    this.payPal = false;
  }

  purchase() {
    this.buy = {
      addressID: this.addressId,
      cardID: this.cardId,
      productsIds: this.productIds,
      total: this.totaleConSconto + 5
    }

    console.log("PAYPAL ABILITATO?: " + this.payPal)

    console.log("ADDRESS ID: " + this.buy.addressID)
    console.log("CARD ID: " + this.buy.cardID)
    this.buy.productsIds.forEach(productId => {console.log("PRODUCTID: " + productId)})
    console.log("TOTALE: " + this.buy.total)

    // Store this.buy in session storage
    sessionStorage.setItem('buy', JSON.stringify(this.buy));

    const custmUrl = this.doOrderURL + "?pay-method=" + this.payPal;
    const headers = this.keyCloakService.permaHeader();
    return this.http.post<string>(custmUrl, this.buy, { headers, responseType: 'text' as 'json' }).subscribe(response => {
      if (response === "Errore...") {
        this.popUp.updateStringa("ERRORE ALDOS")
        this.popUp.openPopups(45, true)
      } else {
        if (response != "Ordine effettuato con successo!") {
          window.location.href = response;
        } else {
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
