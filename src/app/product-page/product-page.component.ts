import { Component } from '@angular/core';
import {PopupService} from "../services/popUpService";
import {Router} from "@angular/router";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductDTO} from "../entities/ProductDTO";
import {ProductService} from "../services/productService";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css', '../../styles.css']
})
export class ProductPageComponent {

  prodotto!: ProductDTO
  date: Date = new Date();

  day: number = this.date.getDate()
  month: number = this.date.getMonth() + 1
  year: number = this.date.getFullYear()
  constructor(protected keyCloak: KeyCloakService, public popUpService:PopupService, private router:Router, private productService: ProductService) {
  }

  ngOnInit() {
    const can= document.getElementById("5-star-graph") as HTMLCanvasElement
    const context = can.getContext('2d');

    this.drawGraphs(context!)
    this.getProductData()
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

  getProductData() {
    this.productService.prendiDatiProdotto().subscribe(response => {
      this.prodotto=response
    })
  }
}
