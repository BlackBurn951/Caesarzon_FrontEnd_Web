import { Injectable } from '@angular/core';
import {PopupService} from "./popUpService";


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  avvisoDisp: string = "Disponibilità ancora non aggiunta"
  disponibilitaAggiunta: boolean = false;

  constructor(private popUpService:PopupService) {
  }

  aggiungiDisp(event: Event){
    event.preventDefault();
    this.popUpService.openPopups(11, true)
  }

  aggiungiDisponibilita(){
    this.disponibilitaAggiunta = true;
    this.avvisoDisp = "Disponibilità aggiunta"
    this.popUpService.closePopup()
  }


}


