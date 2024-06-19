import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {PopupService} from "../services/popUpService";
import {NgIf} from "@angular/common";
import {AddressService} from "../services/addressService";
import {CardsService} from "../services/cardsService";



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

  constructor(private dialogError: MatDialogRef<WarningMessageComponent>, public popup:PopupService, public addressService: AddressService, public cardService: CardsService) {

  }

  ngOnInit() {
    this.popup.currentStringa.subscribe((value) => {
      this.stringa = value;
    });
  }

  confermaOperazione(siOno: number){
    if(siOno === 0 && this.popup.operazione == 0){
      this.popup.openPopups(10, true)
    }else{
      this.popup.closePopup()
    }

  }


  ok(){
    this.dialogError.close();
  }
}
