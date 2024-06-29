import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {PopupService} from "../services/popUpService";
import {NgIf} from "@angular/common";
import {AddressService} from "../services/addressService";
import {CardsService} from "../services/cardsService";
import {AdminService} from "../services/adminService";



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

  constructor(private adminService: AdminService, private dialogError: MatDialogRef<WarningMessageComponent>, public popup:PopupService, public addressService: AddressService, public cardService: CardsService) {

  }

  ngOnInit() {
    this.popup.currentStringa.subscribe((value) => {
      this.stringa = value;
    });
  }

  confermaOperazione(siOno: number){
    if(siOno === 0){
      if(this.popup.operazione == 0)
        this.adminService.deleteReview(this.adminService.reviewId, true).subscribe( response =>{
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

      }
    }else{
      this.popup.closePopup()
    }

  }


  ok(){
    this.dialogError.close();
  }
}
