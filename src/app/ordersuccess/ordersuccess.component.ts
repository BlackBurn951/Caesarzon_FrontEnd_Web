import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CartService} from "../services/cartService";

@Component({
  selector: 'app-ordersuccess',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './ordersuccess.component.html',
  styleUrl: './ordersuccess.component.css'
})
export class OrdersuccessComponent implements OnInit{

  constructor(protected cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService.doSuccess()
  }

}
