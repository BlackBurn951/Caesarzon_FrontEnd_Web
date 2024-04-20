import { Component } from '@angular/core';
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";

@Component({
  selector: 'app-help-request',
  standalone:true,
  imports: [
    UserManagementContainerComponent
  ],
  templateUrl: './help-request.component.html',
  styleUrl: './help-request.component.css'
})
export class HelpRequestComponent {

}


