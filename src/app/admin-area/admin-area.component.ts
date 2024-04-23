import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css', '../../styles.css']
})
export class AdminAreaComponent {
  section: number = 0;
  changeSection(num: number){
    this.section=num;
  }
}
