import {Component, OnInit} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {KeyCloakService} from "../services/keyCloakService";
import {ProductService} from "../services/productService";
import {WishListService} from "../services/wishListService";
import {PopupService} from "../services/popUpService";
import {OrderService} from "../services/orderService";
import {CardsService} from "../services/cardsService";

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
export class OrderSummaryComponent implements OnInit{

  constructor(protected orderService:OrderService, protected productService:ProductService, protected wishListService: WishListService, protected popUpService: PopupService) {

  }

  richiediReso(ordine: number){
    const order = this.orderService.orders.at(ordine);
    if (order) {
      this.orderService.orderId = order.id
      this.orderService.orderIndex = ordine;
    }
    this.popUpService.operazione = 8;
    this.popUpService.updateStringa("Sei sicuro di voler richiedere il reso sull'ordine: " + order?.orderNumber + "?")
    this.popUpService.openPopups(141, false);
  }

  ngOnInit(): void {
    this.orderService.getOrders()
  }

  getRoundedTotal(total: number,discount: number): number{
    const tot = total - discount;
    return parseFloat(tot.toFixed(2));
  }
}
