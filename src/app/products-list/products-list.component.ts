import {Component, OnInit} from '@angular/core';
import { Router} from "@angular/router";
import {ProductService} from "../services/productService";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit{

  constructor(protected productService: ProductService, private router: Router) {
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
