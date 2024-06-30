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


@Injectable({
  providedIn: 'root',
})
export class WishListService{


  wishListProducts!: WishProduct[];
  wishLists!: BasicWishList[];
  singleProducts!: SingleWishListProduct[];

  section!: number ;
  constructor(private router: Router, private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
  }

  getWishListsURL = 'http://localhost:8090/product-api/wishlists'

  getWishListsProductsURL = 'http://localhost:8090/product-api/wishlist/products'


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

  getWishListProducts(wishlistId:string){
    const customUrl = this.getWishListsProductsURL+"?wish-id="+wishlistId
    const headers = this.keycloakService.permaHeader()
    return this.http.get<WishProduct[]>(customUrl, { headers }).subscribe(response =>{
      console.log('WishListProducts Response:', response);
      this.wishListProducts = response
      response.forEach(item =>{
        this.singleProducts = item.singleWishListProductDTOS
      })
    })
  }

  deleteWishList(){

  }

  deleteWishListsProducts(){

  }

  changeVisibility(){

  }

  deletWishListproduct(){

  }


}


