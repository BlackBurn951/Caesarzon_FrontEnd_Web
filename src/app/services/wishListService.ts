import {PopupService} from "./popUpService";
import {KeyCloakService} from "./keyCloakService";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {SingleWishListProduct} from "../entities/SingleWishListProduct";
import {BasicWishList} from "../entities/BasicWishList";
import {Supports} from "../entities/Supports";
import {WishProduct} from "../entities/WishProduct";
import {single} from "rxjs";
import {ProductService} from "./productService";


@Injectable({
  providedIn: 'root',
})
export class WishListService{


  wishListProducts!: WishProduct;
  wishLists!: BasicWishList[];
  showProducts: boolean = false;

  wishId! :string;
  productId!: string;

  visibility!: number;


  section!: number ;
  constructor(private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
  }

  getWishListsURL = 'http://localhost:8090/product-api/wishlists'


  deleteWishListsURL = 'http://localhost:8090/product-api/wishlist/'


  getWishListsProductsURL = 'http://localhost:8090/product-api/wishlist/products'

  deleteWishProductURL = 'http://localhost:8090/product-api/wishlist/product'


  getWishS(num: number){
    this.section = num
    this.getWishLists(num).subscribe( response =>{
      this.wishLists = response
    })
  }

  getWishLists(num: number){
    const customUrl = this.getWishListsURL+"?usr="+this.keycloakService.getUsername()+"&visibility="+num
    const headers = this.keycloakService.permaHeader()
    return this.http.get<BasicWishList[]>(customUrl, { headers });
  }

  getWishListProducts(wishlistId: string) {
    this.showProducts = !this.showProducts; // Toggle visibility
    if (this.showProducts) {
      const customUrl = this.getWishListsProductsURL + "?wish-id=" + wishlistId;
      const headers = this.keycloakService.permaHeader();
      this.http.get<WishProduct>(customUrl, { headers }).subscribe(response => {
        console.log('WishListProducts Response:', response);
        this.wishListProducts = response;
      });
    }
  }


  changeVisibility(num: number, wishId: string){
    let vis = "";
    if(num === 0){
      vis = "Pubblica"
    }else if(num === 1){
      vis = "Condivisa"
    }else{
      vis = "Privata"
    }
    this.popUpService.operazione = 6
    this.popUpService.updateStringa("Sei sicuro di voler cambiare la visibilità della lista in: "+vis+"?")
    this.popUpService.openPopups(123, false)
    this.wishId = wishId;
    this.visibility = num;
  }

  changeVisFunction(){
    const headers = this.keycloakService.permaHeader();
    const customUrl = this.deleteWishListsURL+this.wishId+"?visibility="+this.visibility;
    this.http.put<string>(customUrl, { headers, responseType: 'text' as 'json' }).subscribe(response => {
      if(response === "Visibilità cambiata con successo"){
        this.wishLists = this.wishLists.filter(wish => wish.id !== this.wishId);
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(253, true)
      }else{
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(253, true)
      }
    });
  }


  deleteWishList(wishId: string, nomeLista: string){
    this.popUpService.operazione = 5
    this.popUpService.updateStringa("Sei sicuro di voler eliminare la lista: "+nomeLista+"?")
    this.popUpService.openPopups(123, false)
    this.wishId= wishId;
  }


  deleteWishListFunction(){
    const headers = this.keycloakService.permaHeader();
    const customUrl = this.deleteWishListsURL+this.wishId;
    this.http.delete<string>(customUrl, { headers, responseType: 'text' as 'json' }).subscribe(response => {
      if(response === "Lista desideri eliminata correttamente"){
        this.wishLists = this.wishLists.filter(wish => wish.id !== this.wishId);
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(253, true)
      }else{
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(253, true)
      }
    });
  }


  deleteWishListsProducts(wishId: string, nomeLista: string){
    this.popUpService.operazione = 4
    this.popUpService.updateStringa("Sei sicuro di voler svuotare la lista: "+nomeLista+"?")
    this.popUpService.openPopups(123, false)
    this.wishId= wishId;

  }

  delListProductFunction(){
    const headers = this.keycloakService.permaHeader();
    const customUrl = this.getWishListsProductsURL+"?wish-id="+this.wishId;
    this.http.delete<string>(customUrl, { headers, responseType: 'text' as 'json'  }).subscribe(response => {
      if(response === "Lista desideri svuotata"){
        this.wishListProducts.singleWishListProductDTOS = this.wishListProducts.singleWishListProductDTOS.filter(product => product.productId !== this.productId);
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(253, true)
      }else{
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(253, true)
      }
    });
  }






  deleteWishListproduct(wishId: string, productId: string, nomeProdotto: string){
    this.popUpService.operazione = 3
    this.popUpService.updateStringa("Sei sicuro di voler eliminare il prodotto: "+nomeProdotto+"?")
    this.popUpService.openPopups(123, false)
    this.wishId= wishId;
    this.productId = productId;
  }

  delProductFunction() {
    const headers = this.keycloakService.permaHeader();
    const customUrl = this.deleteWishProductURL + "?wish-id=" + this.wishId + "&product-id=" + this.productId;
    this.http.delete<string>(customUrl, { headers, responseType: 'text' as 'json' }).subscribe(response => {
      if (response === "Prodotto eliminato correttamente dalla lista desideri") {
        this.wishListProducts.singleWishListProductDTOS = this.wishListProducts.singleWishListProductDTOS.filter(product => product.productId !== this.productId);
        this.popUpService.closePopup();
        this.popUpService.updateStringa(response);
        this.popUpService.openPopups(253, true);
      } else {
        this.popUpService.closePopup();
        this.popUpService.updateStringa(response);
        this.popUpService.openPopups(253, true);
      }
    });
  }



}


