import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";
import {WarningMessageComponent} from "../warning-message/warning-message.component";
import {RegistrationComponent} from "../registration/registration.component";
import {AllPopupComponent} from "../all-popup/all-popup.component";

@Injectable({
  providedIn: 'root',
})
export class PopupService {

  isAdd: boolean = false;

  aStringa: string = "Motivo del ban"

  isAvviso: boolean = true;

  isLogin: boolean = true;

  isOther: boolean = true;

  descrizione: string = '';

  wichComponent: number = 0;

  operazione!: number;

  private stringaSource = new BehaviorSubject<string>('');

  currentStringa = this.stringaSource.asObservable();

  constructor(private dialog: MatDialog) {
  }


  updateStringa(value: string) {
    this.stringaSource.next(value);
  }

  toggleLoginR(event: Event) {
    event.preventDefault()
    this.isLogin = !this.isLogin;
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
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
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
