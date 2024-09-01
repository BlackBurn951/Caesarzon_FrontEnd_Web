import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CartService} from "../services/cartService";
import {FooterComponent} from "../footer/footer.component";
import {Router} from "@angular/router";
import {AddressService} from "../services/addressService";
import {ProductService} from "../services/productService";

@Component({
  selector: 'app-ordersuccess',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    FooterComponent
  ],
  templateUrl: './ordersuccess.component.html',
  styleUrls: ['./ordersuccess.component.css', '../../styles.css' ]
})
export class OrdersuccessComponent implements OnInit{

  constructor(private productService: ProductService, protected router: Router, protected cartService: CartService, protected addressService: AddressService) {
  }

  ngOnInit(): void {
    this.cartService.doSuccess()
    this.productService.ricerca =""

  }
  getDateFiveDaysAhead() {
    const today = new Date();

    today.setDate(today.getDate() + 5);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  changePage(page: string, event: Event) {
    event.preventDefault()
    this.router.navigate([page]);
  }

}
