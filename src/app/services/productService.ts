import { Injectable } from '@angular/core';
import {PopupService} from "./popUpService";
import {ProductSearch} from "../entities/ProductSearch";
import {KeyCloakService} from "./keyCloakService";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ProductDTO} from "../entities/ProductDTO";


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  avvisoDisp: string = "Disponibilità ancora non aggiunta"
  disponibilitaAggiunta: boolean = false;

  products! : ProductSearch[]

  urlRicerca: string = 'http://localhost:8090/product-api/search';
  productDataURL: string = 'http://localhost:8090/product-api/product'

  prodotto!: ProductDTO

  ricerca: string = ""
  minPrice!: number;
  maxPrice!: number;
  isClothing!: boolean;
  isEquipment!: boolean;
  sport: string = ""
  coloreSecondario: string = ""
  colorePrimario: string = ""
  marca: string = ""

  constructor(private router: Router, private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
  }


  getProducts(){
    this.sport = ""
    this.colorePrimario = ""
    this.coloreSecondario = ""
    this.marca = ""
    this.getProductsFromServer(0).subscribe(response =>{
      this.products = response
      this.router.navigate(['products-list']);
    })
  }

  applyFilters(event: any): void {
    // Split attuale ricerca into an array of terms
    let ricercaTerms = this.ricerca.split(' ');

    // Remove any empty strings from the array (in case there are any)
    ricercaTerms = ricercaTerms.filter(term => term.trim() !== '');

    // Check if marca is selected
    if (this.marca) {
      // If marca is not already in ricercaTerms, add it
      if (!ricercaTerms.includes(this.marca)) {
        ricercaTerms.push(this.marca);
      }
    }

    // Check if sport is selected
    if (this.sport) {
      // If sport is not already in ricercaTerms, add it
      if (!ricercaTerms.includes(this.sport)) {
        ricercaTerms.push(this.sport);
      }
    }

    // Check if colorePrimario is selected
    if (this.colorePrimario) {
      // If colorePrimario is not already in ricercaTerms, add it
      if (!ricercaTerms.includes(this.colorePrimario)) {
        ricercaTerms.push(this.colorePrimario);
      }
    }

    // Check if coloreSecondario is selected
    if (this.coloreSecondario) {
      // If coloreSecondario is not already in ricercaTerms, add it
      if (!ricercaTerms.includes(this.coloreSecondario)) {
        ricercaTerms.push(this.coloreSecondario);
      }
    }

    // Update this.ricerca with the updated ricercaTerms array
    this.ricerca = ricercaTerms.join(' ');

    // Chiamiamo nuovamente getProductsFromServer per applicare i filtri
    if(this.isClothing != undefined || this.isEquipment != undefined || this.minPrice != undefined || this.maxPrice != undefined){} {

    }
    this.getProductsFromServer(0).subscribe(response => {
      this.products = response;
      this.ricerca = this.ricerca.replace(this.sport, '');
      this.ricerca = this.ricerca.replace(this.colorePrimario, '');
      this.ricerca = this.ricerca.replace(this.coloreSecondario, '');
      this.ricerca = this.ricerca.replace(this.marca, '');

    });


    event.preventDefault();
  }



  getProductsFromServer(num: number){
    const headers = this.keycloakService.permaHeader()
    let urlWithParams;
    if(num == 0){
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

  prendiDatiProdotto(productId: string) {
    const headers = this.keycloakService.permaHeader()
    return this.http.get<ProductDTO>(this.productDataURL+'/'+productId, { headers}).subscribe(response =>{
      if(response != null){
        this.prodotto = response
        this.router.navigate(['product-page']);
      }
    });
  }

}


