import { Component } from '@angular/core';
import { UserManagementContainerComponent } from "../user-management-container/user-management-container.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from "@angular/forms";
import { UserService } from "../services/userService";

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

  motivoRichiesta!: string;
  oggetto!: string;
  descrizioneRichiesta!: string;

  constructor(private userService: UserService) { }

  isFormValid(): boolean {
    return !!this.oggetto && this.oggetto.length >= 5 && this.oggetto.length <= 50 && !!this.descrizioneRichiesta && this.descrizioneRichiesta.length >= 5 && this.descrizioneRichiesta.length <= 500;
  }
  sendHelpRequest() {
    if (this.isFormValid()) {
      this.userService.sendHelps(this.motivoRichiesta, this.oggetto, this.descrizioneRichiesta);
    }
  }
}


