import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";
import {WarningMessageComponent} from "./warning-message/warning-message.component";
import {RegistrationComponent} from "./registration/registration.component";
import {AllPopupComponent} from "./all-popup/all-popup.component";

@Injectable({
  providedIn: 'root',
})
export class PopupService {

  isAdd: boolean = false;

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
    switch (num) {
      case 0:
        this.dialog.open(AllPopupComponent);
        this.wichComponent = 0;
        this.isOther = true;
        this.isAdd = false;
        break;
      case 1:
      case 2:
      case 4:
      case 5:
      case 6:
      case 7:
        this.dialog.open(AllPopupComponent);
        this.wichComponent = num;
        this.isOther = false;
        this.isAdd = true;
        break;
      case 3:
        this.dialog.open(RegistrationComponent);
        this.isLogin = true;
        break;
      default:
        this.isAvviso = avviso;
        this.dialog.open(WarningMessageComponent);
        break;
    }
  }




  closePopup() {
    this.dialog.closeAll()
  }


}
