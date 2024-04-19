import { Component } from '@angular/core';
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css', "../../styles.css"]
})
export class ReviewComponent {

  rating: number = 1;

  descrizione: string = ''; 


  constructor(public popupService: PopupService) {
  }

  rate(rating: number) {
    this.rating = rating;
  }



}
