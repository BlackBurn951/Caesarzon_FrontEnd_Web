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
import {resolve} from "@angular/compiler-cli";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

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

  //Creazione dei campi necessari alla visualizzazione dei dati utente
  nome!: string;
  cognome!: string;
  email!: string ;
  username!: string;

  numero!: string;

  selectedFile!: File;

  imageUrl: SafeUrl | undefined;


  constructor(private sanitizer: DomSanitizer, protected formService: FormService, protected userService: UserService, protected popUpService: PopupService) {
    this.formCaesarzon = formService.getForm()

  }


  //All'inizializzazione della pagina vengono caricati tutti i dati relativi all'utente
  ngOnInit(): void {
    this.userService.getUserData().subscribe(
      (userData: User) => {
        this.formCaesarzon.get('formDatipersonali.nome')?.setValue(userData.firstName);
        this.formCaesarzon.get('formDatipersonali.cognome')?.setValue(userData.lastName);
        this.formCaesarzon.get('formDatipersonali.email')?.setValue(userData.email);
        this.formCaesarzon.get('formDatipersonali.username')?.setValue(userData.username);
        this.formCaesarzon.get('formDatipersonali.cellulare')?.setValue(userData.phoneNumber);

      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
    this.loadImage()

  }

  //Metodo per caricare l'immagine di profilo dal DB
  loadImage(): void {
    this.userService.getUserProfilePic().subscribe(
      response => {
        const url = URL.createObjectURL(response);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      },
      error => {
        console.error('Errore nel caricamento dell\'immagine', error);
      }
    );
  }



  //Metodo per selezionare una foto e caricarla sul DB limitando la dimensione a 6MB
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    const maxSize = 3 * 1024 * 1024; // 6 MB


    if (file) {
      if (file.size > maxSize) {
        this.popUpService.updateStringa("La dimensione massima del file è di 6 MB.");
        this.popUpService.openPopups(104, true)
      }else{
        reader.onload = (e: any) => {
          const preview = document.getElementById('preview');
          if (preview) {
            preview.style.display = 'block';
            preview.setAttribute('src', e.target.result);
          } else {
            console.error("Elemento 'preview' non trovato nel DOM.");
          }
        };
        reader.readAsDataURL(file);
        this.onUpload()
      }
    }

  }

  //Metodo utilizzato nel precedente relativo al caricamento dell'immagine di profilo
  onUpload() {
    if (this.selectedFile) {
      this.userService.uploadImage(this.selectedFile).subscribe(
        response => {
          this.popUpService.updateStringa(response)
          this.popUpService.openPopups(141, true)

        },
        error => {
          console.log(error);
           }
      );
    }
  }

  //Metodo per abilitare la modifica dei dati per l'utente
  abilitaInput(): void{
    this.userService.inputAbilitato = !this.userService.inputAbilitato;
    this.userService.testoButton = this.userService.inputAbilitato ? "Annulla modifiche" : "Modifica dati";
    if(this.userService.testoButton == "Modifica dati"){
      this.setValues()
    }else{
      this.setValuess()
    }


  }

  //Metodi vari per matching e assegnamento valori
  setValues(){
    if (this.formCaesarzon.get('formDatipersonali')) {
      this.formCaesarzon.get('formDatipersonali.nome')?.setValue(this.nome);
      this.formCaesarzon.get('formDatipersonali.cognome')?.setValue(this.cognome);
      this.formCaesarzon.get('formDatipersonali.username')?.setValue(this.username);
      this.formCaesarzon.get('formDatipersonali.email')?.setValue(this.email);
      this.formCaesarzon.get('formDatipersonali.cellulare')?.setValue(this.numero);

    }
  }
  setValuess(){
    if (this.formCaesarzon.get('formDatipersonali')) {
      this.nome = this.formCaesarzon.get('formDatipersonali.nome')?.value;
      this.cognome = this.formCaesarzon.get('formDatipersonali.cognome')?.value;
      this.username = this.formCaesarzon.get('formDatipersonali.username')?.value;
      this.email = this.formCaesarzon.get('formDatipersonali.email')?.value;
      this.numero = this.formCaesarzon.get('formDatipersonali.cellulare')?.value;



    }
  }

  //Controlli di validità dei campi
  valoriUguali() {
    const formDatipersonali = this.formCaesarzon.get('formDatipersonali');

    if (formDatipersonali) {
      return this.nome === formDatipersonali.get('nome')?.value &&
        this.cognome === formDatipersonali.get('cognome')?.value &&
        this.email === formDatipersonali.get('email')?.value &&
        this.username === formDatipersonali.get('username')?.value &&
        this.numero === formDatipersonali.get('cellulare')?.value
    }

    return false;
  }

  //Metodo per mandare le modifiche apportate ai dati dell'utente
  mandaModifiche(){
    this.setValuess()
    this.userService.modifyUser(this.username, this.email, this.nome, this.cognome, this.numero)
  }

  //Metodo per verificare la validità del numero di cellulare che si sta cercando di aggiungere
  isNumeroValid(): boolean {
    const formDatipersonali = this.formCaesarzon.get('formDatipersonali');
    const numero = formDatipersonali?.get('cellulare')?.value;
    if (!numero) {
      return true;
    }
    const numeroPattern = /^\d{10}$/;
    return numeroPattern.test(numero);
  }




}
