import {ChangeDetectorRef, Injectable} from '@angular/core';
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

  newProducts!: ProductSearch[];
  offerProducts!: ProductSearch[];


  urlRicerca: string = 'http://localhost:8090/product-api/search';
  productDataURL: string = 'http://localhost:8090/product-api/product'

  urlLastNine: string = 'http://localhost:8090/product-api/new';
  urlOffer: string = 'http://localhost:8090/product-api/product/offer';

  prodotto!: ProductDTO

  ricerca: string = ""
  minPrice: number = 0;
  maxPrice: number = 0;
  isClothing!: boolean;
  isEquipment!: boolean;
  sport: string = ""
  coloreSecondario: string = ""
  colorePrimario: string = ""
  marca: string = ""
  metodoOrdinamento!: number;

  crescente : boolean = false;
  decrescente: boolean = false;

  constructor(private router: Router, private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
  }


  getProducts(){
    this.sport = ""
    this.colorePrimario = ""
    this.coloreSecondario = ""
    this.marca = ""
    this.getProductsFromServer().subscribe(response =>{
      this.products = response
      this.router.navigate(['products-list']);
    })
  }

  applyFilters(): void {
    let ricercaTerms = this.ricerca.split(' ');
    ricercaTerms = ricercaTerms.filter(term => term.trim() !== '');
    if (this.marca && !ricercaTerms.includes(this.marca)) {
      ricercaTerms.push(this.marca);
    }
    if (this.sport && !ricercaTerms.includes(this.sport)) {
      ricercaTerms.push(this.sport);
    }
    if (this.colorePrimario && !ricercaTerms.includes(this.colorePrimario)) {
      ricercaTerms.push(this.colorePrimario);
    }
    if (this.coloreSecondario && !ricercaTerms.includes(this.coloreSecondario)) {
      ricercaTerms.push(this.coloreSecondario);
    }
    this.ricerca = ricercaTerms.join(' ');

    this.getProductsFromServer().subscribe(response => {
      this.products = response;
      this.ricerca = this.ricerca.replace(this.sport, '');
      this.ricerca = this.ricerca.replace(this.colorePrimario, '');
      this.ricerca = this.ricerca.replace(this.coloreSecondario, '');
      this.ricerca = this.ricerca.replace(this.marca, '');
    });

  }

  resetFiltri(event: any){
    event.preventDefault();
    this.crescente =false
    this.decrescente =false 
    this.sport = ""
    this.colorePrimario = ""
    this.coloreSecondario = ""
    this.marca = ""
    this.isClothing = false;
    this.isEquipment = false;
    this.minPrice = 0;
    this.maxPrice = 0;
    this.metodoOrdinamento = 0
    this.getProductsFromServer()
  }

  getProductsFromServer() {
    const headers = this.keycloakService.permaHeader();
    let urlWithParams = `${this.urlRicerca}?search-text=${this.ricerca}`;

    // Aggiungi i parametri di filtro solo se sono stati impostati
    if (this.minPrice > 0) {
      urlWithParams += `&min-price=${this.minPrice}`;
    }
    if (this.maxPrice > 0) {
      urlWithParams += `&max-price=${this.maxPrice}`;
    }
    if (this.isClothing && !this.isEquipment) {
      urlWithParams += `&is-clothing=true`;
    }else if(!this.isClothing && this.isEquipment) {
      urlWithParams += `&is-clothing=false`;
    }

    return this.http.get<ProductSearch[]>(urlWithParams, { headers, responseType: 'json' });
  }

  getLastNineProducts() {
    const headers = this.keycloakService.permaHeader();
    return this.http.get<ProductSearch[]>(this.urlLastNine, { headers, responseType: 'json' });

  }

  getOffer() {
    const headers = this.keycloakService.permaHeader();
    return this.http.get<ProductSearch[]>(this.urlOffer, { headers, responseType: 'json' });

  }

  aggiungiDisp(event: Event){
    event.preventDefault();
    this.popUpService.openPopups(11, true)
  }

  reorder(num: number) {
    if (num === 0) {
      this.crescente = false;
      this.decrescente = true;
    } else if (num === 1) {
      this.crescente = true;
      this.decrescente = false;
    }
    switch (num) {
      case 0: // Ordinamento crescente
        this.products = this.products.slice().sort((a, b) => a.price - b.price);
        break;
      case 1: // Ordinamento decrescente
        this.products = this.products.slice().sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
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


