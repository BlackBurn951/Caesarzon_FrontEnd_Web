import {Component, OnDestroy} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Event, Router} from "@angular/router";
import {PopupService} from "../services/popUpService";
import {KeyCloakService} from "../services/keyCloakService";
import {AdminService} from "../services/adminService";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatIconButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {MatBadge} from "@angular/material/badge";
import {Notifications} from "../entities/Notification";
import {Subscription} from "rxjs";


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
export class HeaderComponent implements OnDestroy{

  isMenuOpen = false;

  menuOpen = false;

  notifyCount = 0;
  private notifyCountSubscription!: Subscription;

  constructor(public popupService:PopupService, private router: Router, protected keyCloak:KeyCloakService, private adminService: AdminService){
    this.notifyCountSubscription = this.keyCloak.notifyCount$.subscribe(count => {
      this.notifyCount = count;
    });
  }

  ngOnDestroy() {
    this.notifyCountSubscription.unsubscribe();
  }
  goHomepage(){
    this.router.navigate(['']);
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


  changePage(event: MouseEvent,page:string) {
    if(page === "admin-area")
      this.adminService.section = 0
    event.preventDefault()
    this.router.navigate([page]);
  }

  goToAdminArea(event: MouseEvent, page:string, num: number){
    this.adminService.section = num;
    event.preventDefault()
    this.router.navigate([page]);
  }

  toggleMenus(): void {
    this.keyCloak.markRead().subscribe();
    this.menuOpen = !this.menuOpen;
  }

  removeNotification(notification: Notifications): void {
    this.keyCloak.deleteNotify(notification).subscribe();
  }

  toggleDescription(notification: Notifications): void {
    notification.showDescription = !notification.showDescription;
  }




}
