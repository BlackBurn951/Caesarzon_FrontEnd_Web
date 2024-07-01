import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";
import {WishListService} from "../services/wishListService";
import {PopupService} from "../services/popUpService";

@Component({
  selector: 'app-order-summary',
  standalone: true,
    imports: [
        FooterComponent,
        NgForOf,
        NgIf,
        UserManagementContainerComponent
    ],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css', '../../styles.css']
})
export class OrderSummaryComponent {

  constructor(private keyCloak: KeyCloakService, protected productService:ProductService, protected wishListService: WishListService, protected popUpService: PopupService) {

  }
}
