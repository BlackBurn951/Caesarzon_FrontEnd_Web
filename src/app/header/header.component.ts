import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
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
import {count, Subscription} from "rxjs";
import {ProductService} from "../services/productService";
import {FormsModule} from "@angular/forms";
import {FriendFollowerService} from "../services/friendFollowerService";
import {UserService} from "../services/userService";


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
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../styles.css']
})
export class HeaderComponent implements OnDestroy, OnInit{

  isMenuOpen = false;


  notifyCount = 0;
  private notifyCountSubscription!: Subscription;

  constructor(protected friendFollow: FriendFollowerService, protected productService: ProductService, public popupService:PopupService, private router: Router, protected keyCloak:KeyCloakService, private adminService: AdminService){
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications-container')) {
      this.keyCloak.menuOpen = false;
    }
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

  changeSection(event: MouseEvent, num:number, page:string, numResult: number){
    if(num === 0){
      this.adminService.getUsers(false)
      this.goToAdminArea(event, page, numResult)
    }else if(num === 1){
      this.adminService.getReports(false)
      this.goToAdminArea(event, page, numResult)
    }else if(num === 2){
      this.adminService.getSupports(false)
      this.goToAdminArea(event, page, numResult)
    }else if(num === 3){
      this.adminService.getBans(false)
      this.goToAdminArea(event, page, numResult)
    }
  }

  goToAdminArea(event: MouseEvent, page:string, num: number){
    this.adminService.section = num;
    event.preventDefault()
    this.router.navigate([page]);
  }

  toggleMenus(): void {
    setTimeout(() => {
      this.keyCloak.markRead().subscribe();
    }, 2000);
    this.keyCloak.menuOpen = !this.keyCloak.menuOpen;
  }

  removeNotification(notification: Notifications): void {
    this.keyCloak.deleteNotify(notification).subscribe();
  }

  toggleDescription(notification: Notifications): void {
    notification.showDescription = !notification.showDescription;
  }

  ngOnInit(): void {
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })
  }




}
