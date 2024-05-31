import { Component } from '@angular/core';
import {PopupService} from "../services/popUpService";
import {ottieniCittaService} from "../services/ottieni.citta.service";
import {FormGroup} from "@angular/forms";
import {FormService} from "../services/formService";

@Component({
  selector: 'app-all-popup',
  templateUrl: './all-popup.component.html',
  styleUrls: ['./all-popup.component.css', '../../styles.css']
})
export class AllPopupComponent {

  section:number = 0
  sectionLabel:string = "Cerca utenti"

  users = [
    { name: 'Mario Rossi', imgPath: 'path-to-image-1.jpg' },
    { name: 'Giulia Bianchi', imgPath: 'path-to-image-2.jpg' },
    { name: 'Luca Verdi', imgPath: 'path-to-image-3.jpg' }
  ];

  usersFollow = [
    { name: 'Anna Gialli', imgPath: 'path-to-image-4.jpg' },
    { name: 'Paolo Neri', imgPath: 'path-to-image-5.jpg' },
    { name: 'Sara Marroni', imgPath: 'path-to-image-6.jpg' }
  ];

  usersFriend = [
    { name: 'Giovanni Celesti', imgPath: 'path-to-image-7.jpg' },
    { name: 'Eleonora Rosa', imgPath: 'path-to-image-8.jpg' },
    { name: 'Marco Blu', imgPath: 'path-to-image-9.jpg' }
  ];

  formCaesarzon!: FormGroup;


  constructor(public popUpService:PopupService, protected ottieniCittaService: ottieniCittaService, private formService: FormService){
    this.formCaesarzon= this.formService.getForm();

  }

  aggiungiIndirizzo(){

  }

  changeSection(numb: number, label: string) {
    this.section = numb
    this.sectionLabel = label;
  }

}
