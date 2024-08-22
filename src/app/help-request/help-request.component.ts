import {Component, OnInit} from '@angular/core';
import { UserManagementContainerComponent } from "../user-management-container/user-management-container.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from "@angular/forms";
import { UserService } from "../services/userService";
import {AdminService} from "../services/adminService";
import {KeyCloakService} from "../services/keyCloakService";

@Component({
  selector: 'app-help-request',
  standalone: true,
  imports: [
    UserManagementContainerComponent,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './help-request.component.html',
  styleUrls: ['./help-request.component.css', '../../styles.css']
})
export class HelpRequestComponent implements OnInit{

  constructor(private keyCloak: KeyCloakService, protected adminService: AdminService) { }

  //Validazione dei campi
  isFormValid(): boolean {
    return !!this.adminService.oggetto && this.adminService.oggetto.length >= 5 && this.adminService.oggetto.length <= 50
      && !!this.adminService.descrizioneRichiesta && this.adminService.descrizioneRichiesta.length >= 5 && this.adminService.descrizioneRichiesta.length <= 500;
  }

  //Invio della richiesta di supporto previa validazione dei campi
  sendHelpRequest() {
    if (this.isFormValid()) {
      this.adminService.sendHelps(this.adminService.motivoRichiesta, this.adminService.oggetto, this.adminService.descrizioneRichiesta);
    }
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }
}


