import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CartService} from "../services/cartService";
import {FooterComponent} from "../footer/footer.component";
import {Router} from "@angular/router";
import {AddressService} from "../services/addressService";

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

  constructor(protected router: Router, protected cartService: CartService, protected addressService: AddressService) {
  }

  ngOnInit(): void {
    this.cartService.doSuccess()
  }

  changePage(page: string, event: Event) {
    event.preventDefault()
    this.router.navigate([page]);
  }

}
