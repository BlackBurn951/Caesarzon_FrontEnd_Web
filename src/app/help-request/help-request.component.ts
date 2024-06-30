import { Component } from '@angular/core';
import { UserManagementContainerComponent } from "../user-management-container/user-management-container.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from "@angular/forms";
import { UserService } from "../services/userService";
import {AdminService} from "../services/adminService";

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
export class HelpRequestComponent {

  //Creazione dei campi necessari all'ìnvio di una richiesta di supporto


  constructor(protected adminService: AdminService) { }

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
}


