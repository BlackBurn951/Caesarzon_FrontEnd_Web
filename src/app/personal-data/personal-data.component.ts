import {Component, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import {AppModule} from "../app.routes";
import {UserManagementContainerComponent} from "../user-management-container/user-management-container.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [
    NgClass,
    UserManagementContainerComponent,
    FooterComponent
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


  constructor() {

  }

  ngOnInit(): void {

  }

  abilitaInput(): void{
    this.inputAbilitato = !this.inputAbilitato;
    this.testoButton = this.inputAbilitato ? "Salva modifiche" : "Modifica";
  }

}
