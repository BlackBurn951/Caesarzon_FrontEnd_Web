import {Component, OnInit} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {AdminService} from "../services/adminService";
import {KeyCloakService} from "../services/keyCloakService";
import {UserService} from "../services/userService";

@Component({
  selector: 'app-admin-management-container',
  standalone: true,
    imports: [
        MatProgressSpinner,
        NgIf
    ],
  templateUrl: './admin-management-container.component.html',
  styleUrls: ['./admin-management-container.component.css', '../../styles.css']
})
export class AdminManagementContainerComponent implements OnInit{

  constructor(protected userService: UserService, private keycloack: KeyCloakService, protected adminService: AdminService) {
  }

  ngOnInit(): void {
    this.keycloack.getNotify().subscribe(notifies => {
      this.keycloack.notifications = notifies;
    })
  }

}
