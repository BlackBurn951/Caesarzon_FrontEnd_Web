import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { KeyCloakService } from "./keyCloakService";
import { ProductCart } from "../entities/ProductCart";
import {Unvailable} from "../entities/Unvaiable";
import {Buy} from "../entities/Buy";
import {ActivatedRoute, Router} from "@angular/router";
import {SendProductOrderDTO} from "../entities/SendProductToCart";
import {PopupService} from "./popUpService";
import {PayPal} from "../entities/PayPal";
import {AddressService} from "./addressService";
import {CardsService} from "./cardsService";
import {ChangeCart} from "../entities/ChangeCart";
import {Observable} from "rxjs";
import {ProductService} from "./productService";
import {DomSanitizer} from "@angular/platform-browser";
import {Availabilities} from "../entities/Availabilities";


@Injectable({
  providedIn: 'root'
})
export class CartService {

  getCartURL: string = 'http://localhost:8090/product-api/cart'

  checkAvaURL: string = 'http://localhost:8090/product-api/pre-order';

  doOrderURL: string = 'http://localhost:8090/product-api/purchase';

  doSuccesURL: string = 'http://localhost:8090/product-api/success';

  saveLaterURL: string = 'http://localhost:8090/product-api/cart/product/';



  stringaDisponibilita: string = ""

  ordineInviato!: boolean;

  productInCart: ProductCart[] = []
  productLater: ProductCart[] = []

  unvaiable: Unvailable[] = []

  productIds: string[] = []

  payPal: boolean = false;

  buy!: Buy;

  cardId: string = ""
  addressId: string = ""
  selectedCardId: string | null = null;

  totaleSenzaSconto: number = 0;
  totaleConSconto: number = 0;

  productIdToAddCart: string = ""
  size: string | null = ""
  quantity: number = 1;

  private baseUrl = 'http://localhost:8090/product-api'


  constructor(private sanitizer: DomSanitizer, private productService: ProductService, private cardsService:CardsService, private addressService:AddressService, private route: ActivatedRoute, private popUp: PopupService, private router:Router, private http: HttpClient, private keyCloakService: KeyCloakService) { }



  updateProductInCart(id: string, action: number, changeCartDTO: any): Observable<any> {
    const params = new HttpParams().set('action', action.toString());
    const headers = this.keyCloakService.permaHeader();

    return this.http.put(`${this.baseUrl}/cart/product/${id}`, changeCartDTO, { params, headers, responseType: 'text' as 'json' });
  }

  addProductCart(num: number){

    if(this.size === ""){
      this.size = null
    }

    const productToAddCart: SendProductOrderDTO ={
      productID: this.productIdToAddCart,
      size: this.size,
      quantity: this.quantity
    }


    const headers = this.keyCloakService.permaHeader();
    return this.http.post<string>(this.getCartURL, productToAddCart,{headers, responseType: 'text' as 'json'}).subscribe(response => {
      if(response == "Ordine creato con successo!"){
        if(num === 0){
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
          this.goToPayment(104)
        }

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
        this.productInCart = [];
        this.productLater = [];
        this.totaleSenzaSconto = 0;
        this.totaleConSconto = 0;

        response.forEach(product => {
          console.log("valore buy later: " + product.buyLater)
          this.productService.getProductImage(product.id).subscribe(
            response => {
              const url = URL.createObjectURL(response);
              console.log("URL IMMAGINE CARRELLO: " + url)
              product.image = this.sanitizer.bypassSecurityTrustUrl(url);
              console.log("IMMAGINE PRODOTTO CARRELLO: " + product.image)
            },
            error => {
              console.error('Errore nel caricamento dell\'immagine', error);
            }
          );
          if (product.buyLater) {
            this.productLater.push(product);
          } else {
            this.productInCart.push(product);
            this.totaleSenzaSconto += product.total;
            this.totaleConSconto += product.discountTotal;
          }
        });
      }
    });
  }


  saveLater(idProdotto: string, num: number){
    const headers = this.keyCloakService.permaHeader();
    const customURL = this.saveLaterURL+idProdotto+'?action='+num

    const changeCart: ChangeCart = {
      size: "",
      quantity: 0
    }
    return this.http.put<string>(customURL, changeCart,{ headers }).subscribe(response => {
      if (response === "Ordine modificato con successo!") {
        console.log(response)
      }else{
        console.log(response)
      }
    });

  }

  putInCart(size: string, quantity: number, idProduct: string){

    const productToAddCart: SendProductOrderDTO ={
      productID: idProduct,
      size: size,
      quantity: quantity
    }

    const headers = this.keyCloakService.permaHeader();
    return this.http.post<string>(this.getCartURL, productToAddCart,{headers, responseType: 'text' as 'json'}).subscribe(response => {
      if(response == "Ordine creato con successo!"){
        this.size = ""
        this.quantity = 1
        this.productIdToAddCart = ""
      }
    })
  }


  removeFromCart(idProdotto: string){
    const headers = this.keyCloakService.permaHeader();
    const customURL = this.getCartURL+'/'+idProdotto
    return this.http.delete<string>(customURL,{ headers }).subscribe(response => {
      if (response === "Prodotto cancellato con successo") {
        console.log(response)
      }else{
        console.log(response)
      }
    });

  }

  confermaSvuotoCarrello(){
    this.popUp.operazione = 9
    this.popUp.updateStringa("Sei sicuro di voler svuotare il carrello?")
    this.popUp.openPopups(132, false)
  }

  svuotaCarrello(){
    const headers = this.keyCloakService.permaHeader();
    return this.http.delete<string>(this.getCartURL, { headers, responseType: 'text' as 'json' }).subscribe(response => {
      if (response === "Carello svuotato con successo!") {
        this.productInCart = []
        this.productLater = []
        this.popUp.updateStringa(response)
        this.popUp.openPopups(123, true)
        console.log(response)
      }else{
        console.log(response)
      }
    });
  }


  changePay(){
    this.selectedCardId = null;
    this.payPal = true;
  }

  checkAva(num: number) {
    if (num === 0) {
      this.productInCart.forEach(a => {
        if (!this.productIds.includes(a.id)) {
          this.productIds.push(a.id);
        }
      });
    } else {
      const prodottoId = this.productService.prodotto.id;
      if (prodottoId && !this.productIds.includes(prodottoId)) {
        this.productIds.push(prodottoId);
      }
    }

    const headers = this.keyCloakService.permaHeader();
    return this.http.post<Unvailable[]>(this.checkAvaURL, this.productIds,{headers});
  }


  goToPayment(num: number) {
    this.checkAva(num).subscribe(res => {
      if (res === null) {
        this.clearCampi()
        this.router.navigate(['payment-second-page']);
      } else {
        this.unvaiable = res;
        this.stringaDisponibilita = "";
        let size = ""
        res.forEach((item: Unvailable) => {
          this.stringaDisponibilita += `\nProdotto: ${item.name}\n`;
          if(item.availabilities)
            item.availabilities.forEach((avail: Availabilities) => {
              if(avail.size === null){
                size = "Universale"
              }else{
                size = avail.size
              }
              this.stringaDisponibilita += `  - Taglia: ${size} | Disponibilità: ${avail.amount}\n`;
            });
        });
        this.popUp.openPopups(15, true);
      }
    });
  }

  clearCampi(){
    this.stringaDisponibilita = ""
    this.productIds = []
    this.unvaiable = []
    this.productInCart = []
  }

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



  takeCardId(cardId: number){
    this.cardId = this.cardsService.cardsName[cardId]
    this.selectedCardId = this.cardsService.cardsName[cardId]
    this.payPal = false;
  }

  purchase() {
    const diff = parseFloat(this.totaleConSconto.toFixed(2));
    this.buy = {
      addressID: this.addressId,
      cardID: this.cardId,
      productsIds: this.productIds,
      total: diff
    };

    this.addressService.getAddress(this.addressId).subscribe( response =>{
      this.addressService.indirizzoCorrente = response
    })



    sessionStorage.setItem('buy', JSON.stringify(this.buy));

    const custmUrl = this.doOrderURL + "?pay-method=" + this.payPal;
    const headers = this.keyCloakService.permaHeader();
    return this.http.post<string>(custmUrl, this.buy, { headers, responseType: 'text' as 'json' }).subscribe(response => {
      if (response === "Errore...") {
        this.popUp.updateStringa("ERRORE ALDOS")
        this.popUp.openPopups(45, true)
      } else {
        if (this.payPal) {
          window.location.href = response;
        } else if (!this.payPal) {
          this.ordineInviato = true
          this.router.navigate(['order-final']);
        }else if(response === "Errore"){{
          this.popUp.updateStringa("Problemi nell'acquisto, controllare dati o saldo carta")
          this.popUp.openPopups(434, true)
        }

        }
      }
    })
  }





  takeAddressId(addressId: number){
    this.addressId = this.addressService.addressesName[addressId]
  }
}
