import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {FooterComponent} from "../footer/footer.component";
import {PopupService} from "../services/popUpService";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css', '../../styles.css']
})
export class PersonalDataComponent implements OnInit{
  formCaesarzon!: FormGroup;

  nome!: string;
  cognome!: string;
  email!: string ;
  username!: string;

  numeroForm!: string;

  numeroAttuale!: string;

  imageUrls: (any | null)[] = [null];

  constructor(protected formService: FormService, protected userService: UserService) {
    this.formCaesarzon = formService.getForm()

  }

  ngOnInit(): void {
    this.userService.getUserData().subscribe(
      (userData: User) => {
        this.formCaesarzon.get('formDatipersonali.nome')?.setValue(userData.firstName);
        this.formCaesarzon.get('formDatipersonali.cognome')?.setValue(userData.lastName);
        this.formCaesarzon.get('formDatipersonali.email')?.setValue(userData.email);
        this.formCaesarzon.get('formDatipersonali.username')?.setValue(userData.username);
        this.numeroForm = userData.phoneNumber;

      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
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
    this.userService.inputAbilitato = !this.userService.inputAbilitato;
    this.userService.testoButton = this.userService.inputAbilitato ? "Annulla modifiche" : "Modifica dati";
    if(this.userService.testoButton == "Modifica dati"){
      this.setValues()
    }else{
      this.setValuess()
    }


  }

  setValues(){
    if (this.formCaesarzon.get('formDatipersonali')) {
      this.formCaesarzon.get('formDatipersonali.nome')?.setValue(this.nome);
      this.formCaesarzon.get('formDatipersonali.cognome')?.setValue(this.cognome);
      this.formCaesarzon.get('formDatipersonali.username')?.setValue(this.username);
      this.formCaesarzon.get('formDatipersonali.email')?.setValue(this.email);
      this.numeroAttuale = this.numeroForm;

      console.log(this.formCaesarzon.get('formDatipersonali.nome')?.value)
      console.log(this.formCaesarzon.get('formDatipersonali.cognome')?.value)
      console.log(this.formCaesarzon.get('formDatipersonali.username')?.value)
      console.log(this.formCaesarzon.get('formDatipersonali.email')?.value)
      console.log(this.numeroForm)
    }
  }

  setValuess(){
    if (this.formCaesarzon.get('formDatipersonali')) {
      this.nome = this.formCaesarzon.get('formDatipersonali.nome')?.value;
      this.cognome = this.formCaesarzon.get('formDatipersonali.cognome')?.value;
      this.username = this.formCaesarzon.get('formDatipersonali.username')?.value;
      this.email = this.formCaesarzon.get('formDatipersonali.email')?.value;
      this.numeroForm = this.numeroAttuale
    }
  }

  valoriUguali() {
    const formDatipersonali = this.formCaesarzon.get('formDatipersonali');

    if (formDatipersonali) {
      return this.nome === formDatipersonali.get('nome')?.value &&
        this.cognome === formDatipersonali.get('cognome')?.value &&
        this.email === formDatipersonali.get('email')?.value &&
        this.username === formDatipersonali.get('username')?.value &&
        this.numeroForm === this.numeroAttuale
    }

    return false;
  }


  mandaModifiche(){
    this.setValuess()
    this.userService.modifyUser(this.username, this.email, this.nome, this.cognome, this.numeroAttuale)
  }


  isNumeroValid(): boolean {
    const numeroPattern = /^\d{10}$/;
    return numeroPattern.test(this.numeroAttuale);
  }



}
