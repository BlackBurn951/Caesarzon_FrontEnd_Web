import { Component } from '@angular/core';
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-help-request',
  standalone:true,
    imports: [
        UserManagementContainerComponent,
        FooterComponent
    ],
  templateUrl: './help-request.component.html',
  styleUrls: ['./help-request.component.css', '../../styles.css']
})
export class HelpRequestComponent {

}


