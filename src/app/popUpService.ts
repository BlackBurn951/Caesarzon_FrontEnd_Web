import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";
import {WarningMessageComponent} from "./warning-message/warning-message.component";

@Injectable({
  providedIn: 'root',
})
export class PopupService {

  private stringaSource = new BehaviorSubject<string>('');

  currentStringa = this.stringaSource.asObservable();

  constructor(private dialog: MatDialog) {
  }
  apriPopUp() {
    this.dialog.open(WarningMessageComponent, {
      width: '100px'
    });
  }

  updateStringa(value: string) {
    this.stringaSource.next(value);
  }


}
