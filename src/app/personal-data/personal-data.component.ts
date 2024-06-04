import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {FooterComponent} from "../footer/footer.component";
import {PopupService} from "../services/popUpService";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FormService} from "../services/formService";
import {UserService} from "../services/userService";
import {User} from "../entities/User";
import {KeyCloakService} from "../services/keyCloakService";

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
  numero!: string;
  username!: string;

  inputAbilitato: boolean = false;

  testoButton: string = "Modifica dati";

  formCaesarzon!: FormGroup;

  imageUrls: (any | null)[] = [null];



  constructor(private popUpService: PopupService, protected formService: FormService, private userService: UserService, private key: KeyCloakService) {
    this.formCaesarzon = formService.getForm()

  }

  ngOnInit(): void {
    this.userService.getUserData().subscribe(
      (userData: User) => {
        this.nome = userData.firstName;
        this.cognome = userData.lastName;
        this.email = userData.email;
        this.username = userData.username;
        this.numero = userData.phoneNumber;

      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
    if (this.formCaesarzon.get('formRegistrazione')) {
      this.formCaesarzon.get('formRegistrazione.nome')?.setValue(this.nome);
      this.formCaesarzon.get('formRegistrazione.cognome')?.setValue(this.cognome);
      this.formCaesarzon.get('formRegistrazione.username')?.setValue(this.username);
      this.formCaesarzon.get('formRegistrazione.email')?.setValue(this.email);
    }
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
    if (this.formCaesarzon.get('formRegistrazione')) {
      this.formCaesarzon.get('formRegistrazione.nome')?.setValue(this.nome);
      this.formCaesarzon.get('formRegistrazione.cognome')?.setValue(this.cognome);
      this.formCaesarzon.get('formRegistrazione.username')?.setValue(this.username);
      this.formCaesarzon.get('formRegistrazione.email')?.setValue(this.email);
    }
  }

  mandaModifiche(){

  }

}
