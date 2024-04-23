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


  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const preview = document.getElementById('preview');
      if (preview) { // Verifica se preview non è null
        preview.style.display = 'block';
        preview.setAttribute('src', e.target.result);
      } else {
        console.error("Elemento 'preview' non trovato nel DOM.");
      }
    };
    reader.readAsDataURL(file);
  }


  abilitaInput(): void{
    this.inputAbilitato = !this.inputAbilitato;
    this.testoButton = this.inputAbilitato ? "Salva modifiche" : "Modifica";
  }

}
