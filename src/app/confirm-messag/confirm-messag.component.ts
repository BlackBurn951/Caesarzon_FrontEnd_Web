import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-confirm-messag',
  standalone: true,
  imports: [],
  templateUrl: './confirm-messag.component.html',
  styleUrls: ['./confirm-messag.component.css', '../../styles.css']
})
export class ConfirmMessagComponent {

  utente: string = "Aldo";

  constructor(private dialogError: MatDialogRef<ConfirmMessagComponent>, private popup:PopupService) {
  }


  confermaOperazione(siOno: number, operazione: number){
    if(siOno === 0){

    }

  }

}
