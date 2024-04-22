import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [
    FooterComponent,
    UserManagementContainerComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css', '../../styles.css']
})
export class WishListComponent {

  products = [
    { name: 'Grosse palle rosse', imgPath: 'path-to-image-1.jpg' },
    { name: 'Grandi pattini per nani', imgPath: 'path-to-image-2.jpg' },
    { name: 'Cappelli senza cappelle scappellati', imgPath: 'path-to-image-3.jpg' },
    { name: 'Cappelli senza cappelle scappellati', imgPath: 'path-to-image-3.jpg' },
    { name: 'Cappelli senza cappelle scappellati', imgPath: 'path-to-image-3.jpg' },
    { name: 'Cappelli senza cappelle scappellati', imgPath: 'path-to-image-3.jpg' },
    { name: 'Cappelli senza cappelle scappellati', imgPath: 'path-to-image-3.jpg' }
  ];

}
