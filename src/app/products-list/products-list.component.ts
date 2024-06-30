import {Component, OnInit} from '@angular/core';
import { Router} from "@angular/router";
import {ProductService} from "../services/productService";
import {max, min} from "rxjs";
import {KeyCloakService} from "../services/keyCloakService";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css', '../../styles.css']

})
export class ProductsListComponent implements OnInit{


  constructor(protected productService: ProductService, private keyCloak: KeyCloakService) {

  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }

  protected readonly min = min;
  protected readonly max = max;
}
