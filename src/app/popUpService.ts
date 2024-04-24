import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";
import {WarningMessageComponent} from "./warning-message/warning-message.component";
import {RegistrationComponent} from "./registration/registration.component";
import {FriendsPopupComponent} from "./friends-popup/friends-popup.component";

@Injectable({
  providedIn: 'root',
})
export class PopupService {

  isAvviso: boolean = true;

  isLogin: boolean = true;

  isOther: boolean = true;

  rating: number = 1;

  descrizione: string = '';

  wichComponent: number = 0;

  private stringaSource = new BehaviorSubject<string>('');

  currentStringa = this.stringaSource.asObservable();

  constructor(private dialog: MatDialog) {
  }

  rate(rating: number) {
    this.rating = rating;
  }




  updateStringa(value: string) {
    this.stringaSource.next(value);
  }

  toggleLogin(event: Event) {
    event.preventDefault()
    this.isLogin = !this.isLogin;
  }



  openPopups(num: number, avviso: boolean) {
    if(num=== 0){
      this.dialog.open(FriendsPopupComponent);
      this.wichComponent = 0;
      this.isOther = true;
    }else if( num === 1){
      this.dialog.open(FriendsPopupComponent);
      this.wichComponent = 1;
      this.isOther = false;
    }else if ( num === 2){
      this.dialog.open(FriendsPopupComponent);
      this.wichComponent = 2;
      this.isOther = false;
    }else if ( num === 3) {
      this.dialog.open(RegistrationComponent);
      this.isLogin = true
    }else if( num === 4){
      this.wichComponent = 4;
      this.dialog.open(FriendsPopupComponent);
    }else if( num === 5){
      this.wichComponent = 5;
      this.dialog.open(FriendsPopupComponent)
    }else{
      this.isAvviso = avviso;
      this.dialog.open(WarningMessageComponent)
    }




  }

  closePopup() {
    this.dialog.closeAll()
  }


}
