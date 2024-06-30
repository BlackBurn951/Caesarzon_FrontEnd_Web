import {Component, OnInit} from '@angular/core';
import { Router} from "@angular/router";
import {ProductService} from "../services/productService";
import {max, min} from "rxjs";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css', '../../styles.css']

})
export class ProductsListComponent{

  showDetails: boolean = false;

  constructor(protected productService: ProductService, private router: Router) {

  }toggleDetails(){
    this.showDetails = !this.showDetails;
    console.log(this.showDetails)
  }


  goToHomepage(id: number) {
    this.router.navigate(['/homepage/']);
  }

  reload(event: Event): void {
    window.location.reload()
    event.preventDefault()
  }

  protected readonly min = min;
  protected readonly max = max;
}
