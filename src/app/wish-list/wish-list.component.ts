import {Component, OnInit} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {NgForOf, NgIf} from "@angular/common";
import {WishListService} from "../services/wishListService";
import {ProductService} from "../services/productService";
import {PopupService} from "../services/popUpService";

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [
    FooterComponent,
    UserManagementContainerComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css', '../../styles.css']
})
export class WishListComponent implements OnInit{

  constructor(protected productService:ProductService, protected wishListService: WishListService, protected popUpService: PopupService) {

  }

  ngOnInit(): void {
   this.wishListService.getWishS(2)
  }

}
