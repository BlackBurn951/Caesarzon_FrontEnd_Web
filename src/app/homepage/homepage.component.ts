import {Component, OnInit} from '@angular/core';
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";
import {UserService} from "../services/userService";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})



export class HomepageComponent implements OnInit{
  indexNovita: number = 0;
  indexOfferte: number = 0;

  constructor(protected key: KeyCloakService, protected productService: ProductService, protected userService: UserService) {

  }



  ngOnInit() {
    if(this.key.getUsername() == ""){
      this.key.clearCache()
      this.key.login("Guest","Mascalzone1");

    }
    this.productService.ricerca =""

    setTimeout(() => {
      this.productService.initHomepage()
    }, 500);
    this.key.getNotify().subscribe(notifies => {
      this.key.notifications = notifies;
    })
  }





  nextData(id: string) {

    if(id === 'novita'){
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
