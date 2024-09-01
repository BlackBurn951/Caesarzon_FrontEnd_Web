import {Component, OnInit} from '@angular/core';
import {Event, Router} from "@angular/router";
import {KeyCloakService} from "../services/keyCloakService";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{

  constructor( private keyCloak: KeyCloakService, private router: Router) {
  }

  goToHelpRequests()  {
    this.router.navigate(['help-request']);
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }
}
