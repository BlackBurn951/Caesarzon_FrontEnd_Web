import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AppModule} from "../app.routes";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {FooterComponent} from "../footer/footer.component";
import {PopupService} from "../popUpService";

@Component({
  selector: 'app-personal-data',
  standalone: true,
    imports: [
        NgClass,
        UserManagementContainerComponent,
        FooterComponent,
        NgForOf,
        NgIf
    ],
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css', '../../styles.css']
})
export class PersonalDataComponent implements OnInit{

  nome: string = "Alberto";
  cognome!: string;
  email!: string;
  numero!: number;
  password!: string;
  username!: string;

  inputAbilitato: boolean = false;

  testoButton: string = "Modifica";

  imageUrls: (any | null)[] = [null];



  constructor(private popUpService: PopupService) {

  }

  ngOnInit(): void {

  }


  handleFileInput(event: any, index: number) {
    const file = event.target.files[0];
    const maxSize = 3 * 1024 * 1024; // 6 MB

    if (file) {
      if (file.size > maxSize) {
        this.popUpService.updateStringa("La dimensione massima del file è di 6 MB.");
        this.popUpService.apriPopUp();
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          if (!this.imageUrls.includes(imageUrl)) {
            this.imageUrls[index] = imageUrl;
          } else {
            this.popUpService.updateStringa("Immagine già caricata!");
            this.popUpService.apriPopUp();
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }


  openFileInput(event: MouseEvent, index: number) {
    const input = document.getElementById('file-input' + index) as HTMLInputElement;
    if (input) {
      input.click();
    }
    event.preventDefault();
  }

  abilitaInput(): void{
    this.inputAbilitato = !this.inputAbilitato;
    this.testoButton = this.inputAbilitato ? "Salva modifiche" : "Modifica";
  }

}
