import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";
import {WarningMessageComponent} from "./warning-message/warning-message.component";
import {RegistrationComponent} from "./registration/registration.component";
import {ReviewComponent} from "./review/review.component";
import {ReportsComponent} from "./reports/reports.component";
import {FriendsPopupComponent} from "./friends-popup/friends-popup.component";
import {AddWishPopupComponent} from "./add-wish-popup/add-wish-popup.component";
import {CreateWishListComponent} from "./create-wish-list/create-wish-list.component";

@Injectable({
  providedIn: 'root',
})
export class PopupService {

  isLogin: boolean = true;

  private stringaSource = new BehaviorSubject<string>('');

  currentStringa = this.stringaSource.asObservable();

  constructor(private dialog: MatDialog) {
  }
  apriPopUp() {
    this.dialog.open(WarningMessageComponent, {
      width: '100px'
    });
  }

  openWishListAdd(){
    this.dialog.open(AddWishPopupComponent, {
      width: '100px'
    });
  }

  openCreateWishList(){
    this.dialog.open(CreateWishListComponent, {
      width: '100px'
    });
  }
  updateStringa(value: string) {
    this.stringaSource.next(value);
  }

  toggleLogin(event: Event) {
    event.preventDefault()
    this.isLogin = !this.isLogin;

  }

  openPopupLoginRegistration() {
    this.dialog.open(RegistrationComponent);
    this.isLogin = true;
  }

  openPopupReview() {
    this.dialog.open(ReviewComponent);
    this.isLogin = true;
  }

  openPopupReport() {
    this.dialog.open(ReportsComponent);
    this.isLogin = true;
  }

  openPopupFriends() {
    this.dialog.open(FriendsPopupComponent);
    this.isLogin = true;
  }

  closePopup() {
    this.dialog.closeAll()
  }


}
