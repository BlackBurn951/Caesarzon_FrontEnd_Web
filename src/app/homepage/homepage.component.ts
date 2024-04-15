import { Component, OnInit } from '@angular/core';
import { LoginService } from '../loginService';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent{
  isMenuOpen = false;

  constructor(public loginService: LoginService) {
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
