import { Component } from '@angular/core';
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css','../../styles.css']
})
export class ReportsComponent {

  utente: string = "Aldo";
  descrizione!: string;
  motivo!: string;


  constructor(public popupService: PopupService) {
  }

}
