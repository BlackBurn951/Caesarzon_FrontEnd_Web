import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {PopupService} from "../services/popUpService";
import {NgIf} from "@angular/common";
import {AddressService} from "../services/addressService";
import {CardsService} from "../services/cardsService";
import {AdminService} from "../services/adminService";
import {WishListService} from "../services/wishListService";
import {KeyCloakService} from "../services/keyCloakService";
import {OrderService} from "../services/orderService";
import {CartService} from "../services/cartService";
import {ProductService} from "../services/productService";



@Component({
  selector: 'app-warning-message',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.css', '../../styles.css']
})
export class WarningMessageComponent implements OnInit{
  stringa!: String;

  constructor(private productService: ProductService, private cartService: CartService, private orderService: OrderService, private keyCloak: KeyCloakService, private wishListService:WishListService, private adminService: AdminService, private dialogError: MatDialogRef<WarningMessageComponent>, public popup:PopupService, public addressService: AddressService, public cardService: CardsService) {

  }

  ngOnInit() {
    this.popup.currentStringa.subscribe((value) => {
      this.stringa = value;
    });
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })

  }

  confermaOperazione(siOno: number){
    if(siOno === 0){
      if(this.popup.operazione == 0)
        this.adminService.deleteReport(this.adminService.reviewId, true).subscribe(response =>{
          if(response == "Segnalazione eliminata con successo"){
            this.adminService.reports.splice(this.adminService.reportIndex, 1);
            this.popup.updateStringa(response)
            this.popup.openPopups(123, true);
          }
        })
      else if(this.popup.operazione == 1){
        this.addressService.deleteAddress()
      }else if(this.popup.operazione == 2){
        this.cardService.deleteCard()
      }else if(this.popup.operazione == 3){
        this.wishListService.delProductFunction()
      }else if(this.popup.operazione == 4){
        this.wishListService.delListProductFunction()
      }else if(this.popup.operazione == 5){
        this.wishListService.deleteWishListFunction()
      }else if(this.popup.operazione == 6){
        this.wishListService.changeVisFunction()
      }else if(this.popup.operazione == 7){
        this.adminService.deleteReport(this.adminService.reviewId, false).subscribe(response =>{
          if(response == "Segnalazione eliminata con successo"){
            this.adminService.reports.splice(this.adminService.reportIndex, 1);
            this.popup.updateStringa(response)
            this.popup.openPopups(123, true);
          }
        })
      }else if(this.popup.operazione == 8){
        this.orderService.richiediReso().subscribe(response => {
          if(response == "Reso inviato con successo!"){
            const refundedOrder = this.orderService.orders[this.orderService.orderIndex];
            this.orderService.orders.splice(this.orderService.orderIndex, 1);

            this.orderService.refundOrders.push(refundedOrder);

            this.popup.updateStringa(response);
            this.popup.openPopups(123, true);
            setTimeout(() => {
              this.popup.closePopup()
            }, 1500);

          }
        })
      }else if(this.popup.operazione === 9){
        this.cartService.svuotaCarrello()
      }else if(this.popup.operazione === 10){
        this.adminService.rimuoviBan().subscribe(response =>{
          if(response === "Utente sbannato con successo"){
            this.popup.updateStringa(response);
            this.popup.openPopups(123, true);
            setTimeout(() => {
              window.location.reload()
            }, 1500);
          }
        });

      }else if(this.popup.operazione == 11){
        this.adminService.adminDeleteUser()
      }else if(this.popup.operazione == 12) {
        this.productService.rimuoviProdotto()
      }else if(this.popup.operazione == 13) {
        this.productService.deleteReview()
      }


    }else{
      this.popup.closePopup()
    }

  }


  ok(){
    this.dialogError.close();
  }
}
