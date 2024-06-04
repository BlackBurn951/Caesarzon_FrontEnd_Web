import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {FooterComponent} from "../footer/footer.component";
import {FormService} from "../services/formService";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [
    NgClass,
    UserManagementContainerComponent,
    FooterComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css', '../../styles.css']
})
export class PersonalDataComponent implements OnInit{

  nome!: string;
  cognome!: string;
  email!: string;
  numero!: number;
  password!: string;
  username!: string;

  inputAbilitato: boolean = false;

  testoButton: string = "Modifica dati";

  imageUrls: (any | null)[] = [null];

  protected formCaesarzon!: FormGroup;


  constructor(protected formService: FormService) {
    this.formCaesarzon = formService.getForm();
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
    this.testoButton = this.inputAbilitato ? "Annulla modifiche" : "Modifica dati";
  }

  mandaModifiche() {

  }
}
