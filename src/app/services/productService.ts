import {Injectable} from '@angular/core';
import {PopupService} from "./popUpService";
import {ProductSearch} from "../entities/ProductSearch";
import {KeyCloakService} from "./keyCloakService";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ProductDTO} from "../entities/ProductDTO";
import {ProductReview} from "../entities/ProductReview";
import {Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {FormService} from "./formService";


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  urlRicerca: string = 'http://localhost:8090/product-api/search';

  productDataURL: string = 'http://localhost:8090/product-api/product'
  productReviewURL: string= 'http://localhost:8090/product-api/reviews'
  reviewScore: string= 'http://localhost:8090/product-api/reviews/score'

  urlLastNine: string = 'http://localhost:8090/product-api/new';

  urlOffer: string = 'http://localhost:8090/product-api/product/offer';


  protected formCaesarzon!: FormGroup;

  avvisoDisp: string = "Disponibilità ancora non aggiunta"
  disponibilitaAggiunta: boolean = false;

  products! : ProductSearch[]

  newProducts!: ProductSearch[];
  offerProducts!: ProductSearch[];

  prodotto!: ProductDTO
  recensioni!: ProductReview[]
  scoreRecensioni: number[]= [0,0,0,0,0]

  mediaRecensioni: number= 0
  numeroRecensioni: number= 0
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

  constructor(private formService: FormService, private router: Router, private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
    this.formCaesarzon = formService.getForm();

  }

  addReview(productId: string){

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

  prendiDatiProdotto(productId: string) {
    const headers = this.keycloakService.permaHeader()
    return this.http.get<ProductDTO>(this.productDataURL+'/'+productId, { headers}).subscribe(response =>{
      if(response != null){
        this.prodotto = response
        this.recensioni= []
        this.prendiRecensioni(productId) .subscribe({
          next: (response: ProductReview[])=> {
            this.recensioni= response
            this.products.forEach(p =>{
              if(p.productId===productId) {
                this.mediaRecensioni= p.averageReview
                this.numeroRecensioni=  p.reviewsNumber
              }
            })
            this.prendiScoreRecensioni(productId).subscribe(response => {
              if(response!=null) {
                this.scoreRecensioni= response
              }
            })
            this.router.navigate(['product-page']);
          },
          error: (error: any) => {
            if(error.status===500) {
              this.router.navigate(['product-page']);
            }
          }
        });
      }
    });

  }



  sendProductDate(productDTO: ProductDTO){
    this.sendProductDateToServer(productDTO).subscribe(
      response => {
        if(response === "Product aggiunto")
          this.popUpService.updateStringa("Prodotto agggiunto con successo!")
          this.popUpService.openPopups(103, true)
          setTimeout(() => {
            this.popUpService.closePopup()
          }, 3000);
          this.resetFields()
      },
      error => {
        this.popUpService.updateStringa("Problemi nell'aggiunta del prodotto.")
        this.popUpService.openPopups(1034, true)
        this.resetFields()
        console.error('Error sending product data:', error);
      }
    );
  }

  sendProductDateToServer(productDTO: ProductDTO): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    return this.http.post<any>(this.productDataURL, productDTO, { headers, responseType: 'text' as 'json' });
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

  prendiRecensioni(productId: string) {
    const headers = this.keycloakService.permaHeader()
    return this.http.get<ProductReview[]>(this.productReviewURL+'?prod-id='+productId, { headers})
  }

  prendiScoreRecensioni(productId: string) {
    const headers = this.keycloakService.permaHeader()
    return this.http.get<number[]>(this.reviewScore+'?prod-id='+productId, { headers})
  }

  getLastNineProducts() {
    const headers = this.keycloakService.permaHeader();
    return this.http.get<ProductSearch[]>(this.urlLastNine, { headers, responseType: 'json' });

  }

  getOffer() {
    const headers = this.keycloakService.permaHeader();
    return this.http.get<ProductSearch[]>(this.urlOffer, { headers, responseType: 'json' });

  }


  resetFields(){
    this.formService.setFormData(this.formCaesarzon.value);

    this.formCaesarzon.get('formDeiProdotti.nome')?.setValue("");
    this.formCaesarzon.get('formDeiProdotti.marca')?.setValue("");
    this.formCaesarzon.get('formDeiProdotti.descrizione')?.setValue("");
    this.formCaesarzon.get('formDeiProdotti.sconto')?.setValue(0);
    this.formCaesarzon.get('formDeiProdotti.prezzo')?.setValue(0);
    this.formCaesarzon.get('formDeiProdotti.coloreP')?.setValue("");
    this.formCaesarzon.get('formDeiProdotti.coloreS')?.setValue("");
    this.formCaesarzon.get('formDeiProdotti.sport')?.setValue("");
    this.formCaesarzon.get('formDeiProdotti.categoria')?.setValue(false);

    this.formCaesarzon.get('formDisponibilita.quantitaXS')?.setValue(0);
    this.formCaesarzon.get('formDisponibilita.quantitaS')?.setValue(0);
    this.formCaesarzon.get('formDisponibilita.quantitaM')?.setValue(0);
    this.formCaesarzon.get('formDisponibilita.quantitaL')?.setValue(0);
    this.formCaesarzon.get('formDisponibilita.quantitaXL')?.setValue(0);
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
}


