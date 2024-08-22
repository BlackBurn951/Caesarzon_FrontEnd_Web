import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {KeyCloakService} from "../services/keyCloakService";
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/productService";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})



export class HomepageComponent implements OnInit{
  indexNovita: number = 0;
  indexOfferte: number = 0;

  constructor(private key: KeyCloakService, protected productService: ProductService) {

  }

  ngOnInit() {
    if(this.key.getUsername() == ""){
      this.key.login("testman5","CiaoCiao!3");
    }
    this.productService.getLastNineProducts().subscribe(products => {
      this.productService.newProducts = products;
    })
    this.productService.getOffer().subscribe(products => {
      this.productService.offerProducts = products;
      products.forEach(offer => {
      })
    })

    this.key.getNotify().subscribe(notifies => {
      this.key.notifications = notifies;
    })
  }


  nextData(id: string) {

    if(id === 'novita'){
      console.log('sono in novità')
      if (this.productService.newProducts.length === 0)
        return;

      const numVisibleProducts = 3; // Numero di prodotti visibili alla volta

      if (this.indexNovita < this.productService.newProducts.length - numVisibleProducts) {
        this.indexNovita += 1;
      }
    }

    if(id === 'offerte'){
      if (this.productService.offerProducts.length === 0)
        return;

      const numVisibleProducts = 3; // Numero di prodotti visibili alla volta

      if (this.indexOfferte < this.productService.offerProducts.length - numVisibleProducts) {
        this.indexOfferte += 1;
      }
    }


  }


  previusData(id: string){
    if(id === 'novita'){
      if (this.productService.newProducts.length === 0)
        return;

      if (this.indexNovita >0) {
        this.indexNovita -= 1;
      }
    }

    if(id === 'offerte'){
      if (this.productService.offerProducts.length === 0)
        return;

      if (this.indexOfferte > 0) {
        this.indexOfferte -= 1;
      }
    }


  }



}
