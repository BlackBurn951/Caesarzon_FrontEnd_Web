import {Component, OnInit} from '@angular/core';
import {PopupService} from "../services/popUpService";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";
import {AdminService} from "../services/adminService";
import {WishListService} from "../services/wishListService";
import {CartService} from "../services/cartService";
import {UserService} from "../services/userService";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css', '../../styles.css']
})
export class ProductPageComponent implements OnInit{

  date: Date = new Date();

  day: number = 0
  month: number = 0
  year: number = 0
  constructor(private userService:UserService, private cartService:CartService, private wishListService: WishListService, protected adminService: AdminService ,protected keyCloak: KeyCloakService, public popUpService:PopupService, protected productService: ProductService) {
  }

  resetVariables(){
    this.day = 0
    this.month = 0
    this.year = 0
    this.date = new Date()
  }

  ngOnInit() {
    this.resetVariables()
    this.setDataSpedizione()

    this.productService.prendiDatiProdotto(this.productService.getProductIdInCache())

    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })

  }

  eliminaRecensione(idRecensione: string){
    this.productService.deleteReview(idRecensione)
  }

  rimozioneProdotto(){
    this.popUpService.operazione = 12
    this.popUpService.updateStringa("Sei sicuro di voler eliminare il prodotto: "+ this.productService.prodotto.name + "?")
    this.popUpService.openPopups(124, false)
  }

  updateQuantity(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.cartService.quantity = parseInt(selectElement.value, 10);
  }

  updateSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.cartService.size = selectElement.value;
  }

  addProductToCart(num: number){
    this.cartService.clearCampi()
    if (!this.keyCloak.getLoggedStatus() || this.keyCloak.getUsername() === "Guest"){
      this.popUpService.openPopups(3, true)
    }else{
      this.cartService.productIdToAddCart = this.productService.prodotto.id
      if(this.cartService.size === "" && this.productService.prodotto.is_clothing){
        this.popUpService.updateStringa("Seleziona la taglia desiderata")
        this.popUpService.openPopups(23432, true)
      }else{
        this.cartService.addProductCart(num)

      }
    }

  }

  addProductWishList(){
    this.wishListService.productIdToAdd = this.productService.prodotto.id;
    this.wishListService.getAllUserWishLists().subscribe(a => {
      this.wishListService.wishLists = a
    })
    this.popUpService.openPopups(5, true)
  }



  segnala(usernameDaSegnalare: string){
    this.adminService.usernameSegnalato = usernameDaSegnalare;
    this.popUpService.openPopups(1, true)
  }



  setDataSpedizione() {
    this.date.setDate(this.date.getDate() + 5);

    this.day= this.date.getDay()
    this.month= this.date.getMonth()
    this.year= this.date.getFullYear()
  }
}
