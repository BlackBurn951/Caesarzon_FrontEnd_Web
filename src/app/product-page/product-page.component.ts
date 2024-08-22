import {Component, OnInit} from '@angular/core';
import {PopupService} from "../services/popUpService";
import {Router} from "@angular/router";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";
import {HttpClient} from "@angular/common/http";
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
  constructor(private userService:UserService, private cartService:CartService, private wishListService: WishListService, protected adminService: AdminService ,protected keyCloak: KeyCloakService, public popUpService:PopupService, private router:Router, protected productService: ProductService) {
  }

  resetVariables(){
    this.day = 0
    this.month = 0
    this.year = 0
    this.date = new Date()
  }

  ngOnInit() {
    this.resetVariables()
    const can= document.getElementById("5-star-graph") as HTMLCanvasElement
    const context = can.getContext('2d');

    this.drawGraphs(context!)
    this.setDataSpedizione()

    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })

  }

  updateQuantity(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.cartService.quantity = parseInt(selectElement.value, 10);
  }

  updateSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.cartService.size = selectElement.value;
  }

  addProductToCart(){
    if (!this.keyCloak.getLoggedStatus() || this.keyCloak.getUsername() === "guest"){
      this.popUpService.openPopups(3, true)
    }else{
      this.cartService.productIdToAddCart = this.productService.prodotto.id
      if(this.cartService.size === "" && this.productService.prodotto.is_clothing){
        this.popUpService.updateStringa("Seleziona la taglia desiderata")
        this.popUpService.openPopups(23432, true)
      }else{
        this.cartService.addProductCart()

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

  instaBuy(event: Event){
    this.router.navigate(['payment-first-page']);
    event.preventDefault()

  }

  drawGraphs(ctx: CanvasRenderingContext2D) {
    // Ora puoi disegnare sul canvas utilizzando il contesto 2D
    if (ctx) {
      // Esempio di disegno di un rettangolo rosso sul canvas
      ctx.fillStyle = 'red';
      ctx.fillRect(10, 10, 100, 100);
    } else {
      console.error('Impossibile ottenere il contesto 2D per il canvas.');
    }
  }




  setDataSpedizione() {
    this.date.setDate(this.date.getDate() + 5);

    this.day= this.date.getDay()
    this.month= this.date.getMonth()
    this.year= this.date.getFullYear()
  }
}
