import {Component, OnInit} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {KeyCloakService} from "../services/keyCloakService";
import {PopupService} from "../services/popUpService";
import {WishListService} from "../services/wishListService";

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

  constructor(private http: HttpClient, private keycloakService: KeyCloakService, private popUp: PopupService, protected wishListService: WishListService) {

  }

  ngOnInit(): void {
   this.wishListService.getWishS(2)
  }

}
