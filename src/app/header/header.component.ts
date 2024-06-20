import { Component } from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {PopupService} from "../services/popUpService";
import {KeyCloakService} from "../services/keyCloakService";
import {AdminService} from "../services/adminService";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatIconButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {MatBadge} from "@angular/material/badge";
import {NotifyService} from "../services/notifyService";
import {Notifications} from "../entities/Notification";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatIconButton,
    NgForOf,
    MatList,
    MatListItem,
    MatBadge,
    DatePipe,
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../styles.css']
})
export class HeaderComponent {

  isMenuOpen = false;

  menuOpen = false;

  constructor(protected notifyService: NotifyService, public popupService:PopupService, private router: Router, protected keyCloak:KeyCloakService, private adminService: AdminService){
  }
  goHomepage(){
    this.router.navigate(['']);
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


  changePage(event: Event,page:string) {
    if(page === "admin-area")
      this.adminService.section = 0
    this.router.navigate([page]);
    event.preventDefault();
  }

  goToAdminArea(event: Event, page:string, num: number){
    this.adminService.section = num;
    this.router.navigate([page]);
    event.preventDefault();
  }

  toggleMenus(): void {
    this.menuOpen = !this.menuOpen;
    this.notifyService.markAllNotificationsAsRead()
  }

  removeNotification(notification: Notifications): void {
    this.notifyService.notifications = this.notifyService.notifications.filter(n => n.id !== notification.id);
  }

  toggleDescription(notification: Notifications): void {
    notification.showDescription = !notification.showDescription;
  }




}
