import {Component, OnInit} from '@angular/core';
import { Router} from "@angular/router";
import {ProductService} from "../services/productService";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css', '../../styles.css']

})
export class ProductsListComponent implements OnInit{

  showDetails: boolean = false;

  constructor(protected productService: ProductService, private router: Router) {

  }toggleDetails(){
    this.showDetails = !this.showDetails;
    console.log(this.showDetails)
  }

  ngOnInit(){
    this.productService.getProducts()
  }
  goToHomepage(id: number) {
    this.router.navigate(['/homepage/']);
  }

  reload(event: Event): void {
    window.location.reload()
    event.preventDefault()
  }
}
