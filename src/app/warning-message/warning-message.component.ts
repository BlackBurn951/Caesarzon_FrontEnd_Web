import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-warning-message',
  standalone: true,
  imports: [],
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.css', '../../styles.css']
})
export class WarningMessageComponent implements OnInit{
  stringa!: String;

  constructor(private dialogError: MatDialogRef<WarningMessageComponent>, private popup:PopupService) {

  }

  ngOnInit() {
    this.popup.currentStringa.subscribe((value) => {
      this.stringa = value;
    });
  }

  ok(){
    this.dialogError.close();
  }
}
