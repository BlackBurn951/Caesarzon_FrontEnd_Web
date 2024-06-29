import { Injectable } from '@angular/core';
import {PopupService} from "./popUpService";
import {User} from "../entities/User";
import {HttpClient} from "@angular/common/http";
import {ProductDTO} from "../entities/ProductDTO";
import {KeyCloakService} from "./keyCloakService";


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private productDataURL: string = 'http://localhost:8090/product-api/product'

  avvisoDisp: string = "Disponibilità ancora non aggiunta"
  disponibilitaAggiunta: boolean = false;

  constructor(private http: HttpClient, private keycloakService: KeyCloakService, private popUpService:PopupService) {
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


  prendiDatiProdotto() {
    const headers = this.keycloakService.permaHeader()
    return this.http.get<ProductDTO>(this.productDataURL+'/0df5a55f-41b9-452b-9bf0-9d0b3bab5771', { headers});
  }
}


