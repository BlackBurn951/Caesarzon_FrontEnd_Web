
import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {RegistrationComponent} from "./registration/registration.component";

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  isLogin: boolean = true;


  constructor(private dialog: MatDialog){

  }

  toggleLogin(event: Event) {
    event.preventDefault()
    this.isLogin = !this.isLogin;
  }


  openPopup() {
    this.dialog.open(RegistrationComponent);
    this.isLogin = true;
  }

  closePopup() {
    this.dialog.closeAll()
  }

}
