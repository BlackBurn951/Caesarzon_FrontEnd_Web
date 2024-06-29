import { Injectable } from '@angular/core';
import {PopupService} from "./popUpService";
import {ProductSearch} from "../entities/ProductSearch";
import {KeyCloakService} from "./keyCloakService";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  avvisoDisp: string = "Disponibilità ancora non aggiunta"
  disponibilitaAggiunta: boolean = false;

  products! : ProductSearch[]

  urlRicerca: string = 'http://localhost:8090/product-api/search';

  ricerca: string = ""
  minPrice!: number;
  maxPrice!: number;
  isClothing!: boolean;

  constructor(private router: Router, private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
  }


  getProducts(){
    this.getProductsFromServer(0).subscribe(response =>{
      this.products = response
      this.router.navigate(['products-list']);
    })
  }

  applyFilters(): void {
    // Funzione per applicare i filtri ai prodotti
    this.products = this.products.filter(item => {
      // Esempio di filtro per prezzo
      return (!this.minPrice || item.price >= this.minPrice) &&
        (!this.maxPrice || item.price <= this.maxPrice);
      // Aggiungere altri filtri se necessario
    });
  }


  getProductsFromServer(num: number){
    const headers = this.keycloakService.permaHeader()
    let urlWithParams;
    console.log("RICERCA: " + this.ricerca);
    if(num == 0){
      // urlWithParams = `${this.urlRicerca}?search-text=${this.ricerca}`;
      urlWithParams = `${this.urlRicerca}?search-text=${this.ricerca}`;
    }else{
      urlWithParams = `${this.urlRicerca}?search-text=${this.ricerca}&min-price=${this.minPrice}&max-price=${this.maxPrice}&is-clothing=${this.isClothing}`;

    }
    return this.http.get<ProductSearch[]>(urlWithParams, {headers, responseType: 'json'});
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


