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
import {WishList} from "../entities/WishList";


@Injectable({
  providedIn: 'root',
})
export class WishListService{


  wishListProducts!: WishProduct;
  wishLists!: BasicWishList[];
  showProductsMap: Record<string, boolean> = {};

  wishId! :string;
  productId!: string;
  tipoListe: string= "Liste private"
  visibility!: number;
  emptyList: boolean = false;

  visibilitaNuovaLista!: string;
  nomeNuovaLista!: string;


  section!: number ;
  constructor(private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
  }

  getWishListsURL = 'http://localhost:8090/product-api/wishlists'


  deleteWishListsURL = 'http://localhost:8090/product-api/wishlist/'

  createWishListsURL = 'http://localhost:8090/product-api/wishlist'

  putVisibilityWishListsURL = 'http://localhost:8090/product-api/wishlist/visibility'


  getWishListsProductsURL = 'http://localhost:8090/product-api/wishlist/products'

  deleteWishProductURL = 'http://localhost:8090/product-api/wishlist/product'


  getWishS(num: number){
    this.section = num
    if(num === 0){
      this.tipoListe = "Liste pubbliche"
    }else if(num === 1){
      this.tipoListe = "Liste condivise"
    }else{
      this.tipoListe = "Liste private"

    }
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
    this.wishListProducts = { visibility: "", singleWishListProductDTOS: [] }; // Resetta la lista dei prodotti
    this.emptyList = false; // Resetta il flag della lista vuota

    this.showProductsMap[wishlistId] = !this.showProductsMap[wishlistId];
    if (this.showProductsMap[wishlistId]) {
      const customUrl = `${this.getWishListsProductsURL}?wish-id=${wishlistId}`;
      const headers = this.keycloakService.permaHeader();
      this.http.get<WishProduct>(customUrl, { headers }).subscribe({
        next: (response: WishProduct) => {
          if (response.singleWishListProductDTOS.length > 0) {
            this.wishListProducts = response;
            this.emptyList = false;
          } else {
            this.emptyList = true;
          }
        },
        error: (error: any) => {
          if (error.status === 404) {
            this.emptyList = true;
          }
        }
      });
    }
  }

  createNewWishList() {
    const headers = this.keycloakService.permaHeader();

    const wishList: WishList = {
      id: "",
      visibility: this.visibilitaNuovaLista,
      name: this.nomeNuovaLista,
      userUsername: ""
    }

    this.addWishList(wishList).subscribe(
      response => {
        this.popUpService.closePopup()
        this.nomeNuovaLista = ""
        this.visibilitaNuovaLista = ""
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(177, true)
      },
      error => {
        console.error('Error sending user data:', error);
      }
    );
  }


  addWishList(wishList: WishList){
    const headers = this.keycloakService.permaHeader()
    return this.http.post<any>(this.createWishListsURL, wishList, { headers, responseType: 'text' as 'json' });

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
    console.log("TOKKEN: " + this.keycloakService.getAccessToken())
    const customUrl = this.putVisibilityWishListsURL+"?wish-id="+this.wishId+"&visibility="+1;
    this.http.post<string>(customUrl, { headers, responseType: 'text' as 'json' }).subscribe(response => {
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






  deleteWishListproduct(productId: string, nomeProdotto: string){
    this.popUpService.operazione = 3
    this.popUpService.updateStringa("Sei sicuro di voler eliminare il prodotto: "+nomeProdotto+"?")
    this.popUpService.openPopups(123, false)
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


