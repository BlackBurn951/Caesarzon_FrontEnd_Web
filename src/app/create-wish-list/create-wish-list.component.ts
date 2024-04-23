import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-create-wish-list',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './create-wish-list.component.html',
  styleUrls: ['./create-wish-list.component.css', '../../styles.css']
})
export class CreateWishListComponent {

  constructor(public popupService:PopupService) {
  }

}
