import { Component } from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {AdminService} from "../services/adminService";

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
export class AdminManagementContainerComponent {

  constructor(protected adminService: AdminService) {
  }

}
