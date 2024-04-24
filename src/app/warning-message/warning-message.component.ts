import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {PopupService} from "../popUpService";
import {NgIf} from "@angular/common";

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

  constructor(private dialogError: MatDialogRef<WarningMessageComponent>, public popup:PopupService) {

  }

  ngOnInit() {
    this.popup.currentStringa.subscribe((value) => {
      this.stringa = value;
    });
  }

  confermaOperazione(siOno: number, operazione: number){
    if(siOno === 0){

    }

  }


  ok(){
    this.dialogError.close();
  }
}
