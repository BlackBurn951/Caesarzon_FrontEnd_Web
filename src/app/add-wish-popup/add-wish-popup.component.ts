import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-add-wish-popup',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './add-wish-popup.component.html',
  styleUrls: ['./add-wish-popup.component.css', '../../styles.css']
})
export class AddWishPopupComponent {

  constructor(public popupService: PopupService) {
  }

}
