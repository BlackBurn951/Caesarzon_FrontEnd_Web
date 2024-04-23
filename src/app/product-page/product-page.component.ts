import { Component } from '@angular/core';
import {PopupService} from "../popUpService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css', '../../styles.css']
})
export class ProductPageComponent {

  constructor(public popUpService:PopupService, private router:Router) {
  }

  ngOnInit() {
    const can= document.getElementById("5-star-graph") as HTMLCanvasElement
    const context = can.getContext('2d');

    this.drawGraphs(context!)

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
}
