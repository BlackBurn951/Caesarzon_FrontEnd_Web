import {PopupService} from "./popUpService";
import {KeyCloakService} from "./keyCloakService";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BasicWishList} from "../entities/BasicWishList";
import {WishProduct} from "../entities/WishProduct";
import {WishList} from "../entities/WishList";
import {ChangeVisibility} from "../entities/ChangeVisibility";
import {SendWishlistProductDTO} from "../entities/SenProductWishList";
import {UserService} from "./userService";


@Injectable({
  providedIn: 'root',
})
export class WishListService{


  wishListProducts: WishProduct | null = null;
  wishLists: BasicWishList[] = [];

  userWishLists: BasicWishList[] = [];

  wishListProductsMap: Record<string, WishProduct> = {};
  showProductsMap: Record<string, boolean> = {};

  wishId! :string;
  productId!: string;
  tipoListe: string= "Liste private"
  tipoListeUser: string= "Liste pubbliche"
  visibility!: number;
  emptyList: boolean = false;

  visibilitaNuovaLista!: string;
  nomeNuovaLista!: string;
  creazioneListaValue!: number;



  productIdToAdd: string = "";

  wishListToAddProduct: string = "";

  section!: number ;
  constructor(private userService: UserService, private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
  }

  getWishListsURL = 'http://localhost:8090/product-api/wishlists'

  getAllUserWishListsURL = 'http://localhost:8090/product-api/wishlists/all'

  addProductToWishListURL = 'http://localhost:8090/product-api/wishlist/product'

  deleteWishListsURL = 'http://localhost:8090/product-api/wishlist/'

  createWishListsURL = 'http://localhost:8090/product-api/wishlist'

  putVisibilityWishListsURL = 'http://localhost:8090/product-api/wishlist/visibility'


  getWishListsProductsURL = 'http://localhost:8090/product-api/wishlist/products'

  deleteWishProductURL = 'http://localhost:8090/product-api/wishlist/product'


  getUserWishList(num: number, username: string){
    if(num === 0){
      this.tipoListeUser = "Liste pubbliche"
    }else{
      this.tipoListeUser = "Liste condivise con te"
    }
    this.userWishLists = []
    this.getWishLists(num, username).subscribe( response =>{
      this.userWishLists = response
    })
  }

  getWishS(num: number, username: string){
    this.section = num
    if(num === 0){
      this.tipoListe = "Liste pubbliche"
    }else if(num === 1){
      this.tipoListe = "Liste condivise"
    }else{
      this.tipoListe = "Liste private"

    }
    this.getWishLists(num, username).subscribe( response =>{
      this.wishLists = response
    })
  }


  getWishLists(vis: number, username: string){
    let customUrl ;

    if(this.userService.nomeProfilo === ""){
      customUrl = this.getWishListsURL+"?usr="+this.keycloakService.getUsername()+"&visibility="+vis
    }else{
      customUrl = this.getWishListsURL+"?usr="+username+"&visibility="+vis

    }
    const headers = this.keycloakService.permaHeader()
    return this.http.get<BasicWishList[]>(customUrl, { headers });
  }

  getAllUserWishLists(){
    const headers = this.keycloakService.permaHeader()
    return this.http.get<BasicWishList[]>(this.getAllUserWishListsURL, { headers });
  }


  getWishListProducts(wishlistId: string) {
    this.emptyList = false;
    this.showProductsMap[wishlistId] = !this.showProductsMap[wishlistId];

    if (this.showProductsMap[wishlistId]) {
      let customUrl
      if(this.userService.nomeProfilo === ""){
        customUrl = `${this.getWishListsProductsURL}?wish-id=${wishlistId}&usr=${this.keycloakService.getUsername()}`;
      }else{
        customUrl = `${this.getWishListsProductsURL}?wish-id=${wishlistId}&usr=${this.userService.nomeProfilo}`;

      }
      const headers = this.keycloakService.permaHeader();

      this.http.get<WishProduct>(customUrl, { headers }).subscribe({
        next: (response: WishProduct) => {

          if (response.singleWishListProductDTOS && response.singleWishListProductDTOS.length > 0) {
            this.wishListProductsMap[wishlistId] = response;
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
    let visNum: number;
    if(this.visibilitaNuovaLista === "Pubblica"){
      visNum = 0
    }else if(this.visibilitaNuovaLista === "Condivisa"){
      visNum = 1
    }else{
      visNum = 2
    }
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
        if(this.creazioneListaValue != 104){
          setTimeout(()=>{
            window.location.reload()
          }, 1500);
        }
        this.getWishLists(visNum, '')
      },
      error => {
        console.error('Error sending user data:', error);
      }
    );
  }



  addProductToWishList() {
  const wishList: SendWishlistProductDTO = {
    productID: this.productIdToAdd,
    wishlistID: this.wishListToAddProduct
  };

  const headers = this.keycloakService.permaHeader();

  return this.http.post<string>(this.addProductToWishListURL, wishList, { headers, responseType: 'text' as 'json' })
    .toPromise()
    .then(response => {
      this.popUpService.closePopup();
      this.popUpService.updateStringa("Prodotto aggiunto alla lista");
      this.popUpService.openPopups(324, true);
    })
    .catch(error => {
      if (error instanceof HttpErrorResponse && error.status === 500) {
        this.popUpService.closePopup();
        this.popUpService.updateStringa("Errore o prodotto già presente nella lista");
        this.popUpService.openPopups(324, true);
      }
    });
}


  addWishList(wishList: WishList){
    const headers = this.keycloakService.permaHeader()
    return this.http.post<any>(this.createWishListsURL, wishList, { headers, responseType: 'text' as 'json' });

  }

  updateWishListID(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    console.log("Selected Wish List ID: ", selectedId); // Aggiungi questo per vedere se viene chiamato
    this.setWishListID(selectedId);
  }

  setWishListID(id: string) {
    console.log("Setting Wish List ID: ", id); // Aggiungi questo per vedere se l'ID viene settato
    this.wishListToAddProduct = id;
  }

  changeVisibility(num: number, wishId: string){
    let vis;
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

    const change: ChangeVisibility = {
      visibility: this.visibility,
      wishId: this.wishId
    }

    this.http.put<string>(this.putVisibilityWishListsURL, change,{ headers, responseType: 'text' as 'json' }).subscribe(response => {
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
        if(this.wishLists && this.wishLists.length > 0)
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
        if(this.wishListProducts) {
          if (this.wishListProducts.singleWishListProductDTOS && this.wishListProducts.singleWishListProductDTOS.length > 0)
            this.wishListProducts.singleWishListProductDTOS = this.wishListProducts.singleWishListProductDTOS.filter(product => product.productId !== this.productId);
        }
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(253, true)
        setTimeout(()=>{
          window.location.reload()
        }, 1500);
      }else{
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(253, true)
        setTimeout(()=>{
          window.location.reload()
        }, 1500);
      }
    });
  }

  deleteWishListproduct(wishId: string, productId: string, nomeProdotto: string){
    this.popUpService.operazione = 3
    this.popUpService.updateStringa("Sei sicuro di voler eliminare il prodotto: "+nomeProdotto+"?")
    this.popUpService.openPopups(123, false)
    this.wishId = wishId
    this.productId = productId;
  }

  delProductFunction() {
    const headers = this.keycloakService.permaHeader();
    const customUrl = this.deleteWishProductURL + "?wish-id=" + this.wishId + "&product-id=" + this.productId;
    this.http.delete<string>(customUrl, { headers, responseType: 'text' as 'json' }).subscribe(response => {
      if (response === "Prodotto eliminato correttamente dalla lista desideri") {
        if(this.wishListProducts){
          if(this.wishListProducts.singleWishListProductDTOS && this.wishListProducts.singleWishListProductDTOS.length > 0)
            this.wishListProducts.singleWishListProductDTOS = this.wishListProducts.singleWishListProductDTOS.filter(product => product.productId !== this.productId);
        }
        this.popUpService.closePopup();
        this.popUpService.updateStringa(response);
        this.popUpService.openPopups(253, true);
        setTimeout(()=>{
          window.location.reload()
        }, 1500);
      } else {
        this.popUpService.closePopup();
        this.popUpService.updateStringa(response);
        this.popUpService.openPopups(253, true);
        setTimeout(()=>{
          window.location.reload()
        }, 1500);
      }
    });
  }



}


