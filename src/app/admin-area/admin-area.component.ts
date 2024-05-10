import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css', '../../styles.css']
})
export class AdminAreaComponent {
  section: number = 0;
  isCollapsed: boolean[] = [];
  userInput: string = '';
  risultatiFiltrati: any[] = []; // Array per memorizzare i risultati filtrati
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Aggiungi qui i tuoi dati degli elementi, questo è solo un esempio

  constructor( private router: Router) {
  }
  changeSection(num: number) {
    this.section = num;
  }

  toggleCollapse(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  deleteItem(index: number): void {
    // Codice per eliminare l'elemento dall'array items
    // Aggiorna l'array isCollapsed se necessario
    this.items.splice(index, 1);
    this.isCollapsed.splice(index, 1);
  }

  changePage(event: Event,page:string) {
    this.router.navigate([page]);
    event.preventDefault();
  }
}

