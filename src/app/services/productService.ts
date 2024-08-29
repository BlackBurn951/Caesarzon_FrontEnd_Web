import {Injectable} from '@angular/core';
import {PopupService} from "./popUpService";
import {ProductSearch} from "../entities/ProductSearch";
import {KeyCloakService} from "./keyCloakService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {ProductDTO} from "../entities/ProductDTO";
import {ProductReview} from "../entities/ProductReview";
import {Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {FormService} from "./formService";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

class AvailabilitiesSingle{
  amount!: number;
  size!: string
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  urlRicerca: string = 'http://localhost:8090/product-api/search';

  productDataURL: string = 'http://localhost:8090/product-api/product'
  productReviewURL: string= 'http://localhost:8090/product-api/reviews'

  addProductReviewURL: string= 'http://localhost:8090/product-api/review'

  reviewScore: string= 'http://localhost:8090/product-api/reviews/score'

  urlLastNine: string = 'http://localhost:8090/product-api/new';

  urlOffer: string = 'http://localhost:8090/product-api/product/offer';

  manageImageProductURL = 'http://localhost:8090/product-api/image';

  protected formCaesarzon!: FormGroup;

  avvisoDisp: string = "Disponibilità ancora non aggiunta"
  disponibilitaAggiunta: boolean = false;

  products: ProductSearch[] = []
  nuovoProdotto: boolean = true
  newProducts: ProductSearch[]  = [];
  offerProducts: ProductSearch[] = [];
  acquistoRapido :boolean = false
  prodotto: ProductDTO | null = null
  recensioni: ProductReview[] = []
  scoreRecensioni: number[]= [0,0,0,0,0]
  reviewId: string = ""
  immagineCaricataModifica: boolean = false
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

  selectedFile: File | null = null;

  imageUrl: SafeUrl | undefined;

  valutazioneRecensione: number = 1
  descrizioneRecensione: string = ""
  numPagRec: number = 0;
  constructor( private sanitizer: DomSanitizer, private formService: FormService, private router: Router, private http: HttpClient, private popUpService:PopupService, private keycloakService: KeyCloakService) {
    this.formCaesarzon = formService.getForm();

  }


  initHomepage(){
    this.keycloakService.loading = true
    this.getLastNineProducts().subscribe(products => {
      this.newProducts = products;
      this.newProducts.forEach(prod =>{
        this.getProductImage(prod.productId).subscribe(
          response => {
            const url = URL.createObjectURL(response);
            prod.image = this.sanitizer.bypassSecurityTrustUrl(url);
            this.keycloakService.loading = false
          },
          error => {
            console.error('Errore nel caricamento dell\'immagine', error);
            this.keycloakService.loading = false

          }
        );
      })
    })
    this.getOffer().subscribe(products => {
      this.offerProducts = products;
      this.offerProducts.forEach(prod =>{
        this.getProductImage(prod.productId).subscribe(
          response => {
            const url = URL.createObjectURL(response);
            prod.image = this.sanitizer.bypassSecurityTrustUrl(url);
            this.keycloakService.loading = false
          },
          error => {
            console.error('Errore nel caricamento dell\'immagine', error);
            this.keycloakService.loading = false

          }
        );
      })

    })
  }


  deleteReview(){
    const headers = this.keycloakService.permaHeader();
    const customURL = this.addProductReviewURL+'?product-id='+this.reviewId
    return this.http.delete<string>(customURL,{ headers, responseType: 'text' as 'json' }).subscribe(response =>{
      if(response === "Recensione eliminata"){
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(123, true)
      }else{
        this.popUpService.updateStringa("Problemi nell'eliminazione della recensione")
        this.popUpService.openPopups(123, true)
      }
    })
  }

  rimuoviProdotto(){
    const headers = this.keycloakService.permaHeader();
    var customURL = ""
    if(this.prodotto != null){
      customURL = this.productDataURL+'/'+this.prodotto.id
    }
    return this.http.delete<string>(customURL,{ headers, responseType: 'text' as 'json' }).subscribe(response =>{
      if(response === "Prodotto eliminato"){
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(123, true)
      }else{
        this.popUpService.updateStringa("Problemi nell'eliminazione del prodtto")
        this.popUpService.openPopups(123, true)
      }
    })

  }

  uploadImage(file: File, id: string): Observable<any> {
    console.log(file)
    const formData = new FormData();
    formData.append('file', file, file.name);


    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.keycloakService.getAccessToken()
    });

    const customURL = this.manageImageProductURL+'/'+id

    return this.http.put(customURL, formData, { headers, responseType: 'text'});
  }


  // Metodo per aggiungere il prodotto
  aggiungiProdotto() {
    this.formService.setFormData(this.formCaesarzon.value);

    const nome = this.formCaesarzon.get('formDeiProdotti.nome')?.value;
    const marca = this.formCaesarzon.get('formDeiProdotti.marca')?.value;
    const descrizione = this.formCaesarzon.get('formDeiProdotti.descrizione')?.value;
    const sconto = this.formCaesarzon.get('formDeiProdotti.sconto')?.value;
    const prezzo = this.formCaesarzon.get('formDeiProdotti.prezzo')?.value;
    const coloreP = this.formCaesarzon.get('formDeiProdotti.coloreP')?.value;
    const coloreS = this.formCaesarzon.get('formDeiProdotti.coloreS')?.value;
    const sport = this.formCaesarzon.get('formDeiProdotti.sport')?.value;

    let is_clothing = false;
    const categoria = this.formCaesarzon.get('formDeiProdotti.categoria')?.value;
    if (categoria === "true") {
      is_clothing = true;
    }

    const quantitaXS = this.formCaesarzon.get('formDisponibilita.quantitaXS')?.value;
    const quantitaS = this.formCaesarzon.get('formDisponibilita.quantitaS')?.value;
    const quantitaM = this.formCaesarzon.get('formDisponibilita.quantitaM')?.value;
    const quantitaL = this.formCaesarzon.get('formDisponibilita.quantitaL')?.value;
    const quantitaXL = this.formCaesarzon.get('formDisponibilita.quantitaXL')?.value;

    let ava: AvailabilitiesSingle[] = [];

    if (quantitaXS != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "XS";
      singleAva.amount = quantitaXS;
      ava.push(singleAva);
    }

    if (quantitaS != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "S";
      singleAva.amount = quantitaS;
      ava.push(singleAva);
    }

    if (quantitaM != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "M";
      singleAva.amount = quantitaM;
      ava.push(singleAva);
    }

    if (quantitaL != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "L";
      singleAva.amount = quantitaL;
      ava.push(singleAva);
    }

    if (quantitaXL != 0) {
      let singleAva = new AvailabilitiesSingle();
      singleAva.size = "XL";
      singleAva.amount = quantitaXL;
      ava.push(singleAva);
    }

    let ids = ""
    if(!this.nuovoProdotto) {
      if (this.prodotto != null) {
        ids = this.getProductIdInCache()
      }else{
        ids = ""
      }
    }
    console.log("ID PRODOTTO PRESO DALLA CACHE: " + ids)

    const sendProduct: ProductDTO = {
      id: ids,
      name: nome,
      brand: marca,
      description: descrizione,
      discount: sconto,
      price: prezzo,
      primaryColor: coloreP,
      secondaryColor: coloreS,
      sport: sport,
      is_clothing: is_clothing,
      availabilities: ava,
      lastModified: ""

    };

    this.sendProductDate(sendProduct)
  }

  addReview(){
    var pId = ""
    if(this.prodotto != null){
      pId = this.prodotto.id
    }
    const review: ProductReview ={
      id: "",
      text: this.descrizioneRecensione,
      evaluation: this.valutazioneRecensione,
      username: "",
      productID: pId,
      date: ""
    }

    this.sendReviewData(review).subscribe(response =>{
      if(response === "Recensione aggiunta con successo!"){
        this.popUpService.closePopup()
        this.popUpService.updateStringa(response)
        this.popUpService.openPopups(69, true)
        this.valutazioneRecensione = 1
        this.descrizioneRecensione = ""
        setTimeout(()=>{
          window.location.reload()
        }, 1500);
      }else{
        this.popUpService.closePopup()
        this.popUpService.updateStringa("Errore o limite di recensioni raggiunte")
        this.popUpService.openPopups(69, true)
        this.valutazioneRecensione = 1
        this.descrizioneRecensione = ""
      }
    })

  }

  modificaProdotto(){
    this.nuovoProdotto = false
    this.caricaDatiProdotto()
    this.disponibilitaAggiunta = true
    this.immagineCaricataModifica = true
    this.router.navigate(['product-management'])

  }
  caricaDatiProdotto() {
    const prodotto = this.prodotto;
    var amountXS = 0
    var amountS = 0
    var amountM = 0
    var amountL = 0
    var amountXL = 0
    if(prodotto != null)
    prodotto.availabilities.forEach(ava =>{
      if(ava.size === "XS"){
        amountXS = ava.amount
      }else if(ava.size === "S"){
        amountS = ava.amount
      }else if(ava.size === "M"){
        amountM = ava.amount
      }else if(ava.size === "L"){
        amountL = ava.amount
      }else{
        amountXL = ava.amount
      }
    })



    if (prodotto) {
      this.formService.getForm().patchValue({
        formDeiProdotti: {
          nome: prodotto.name,
          marca: prodotto.brand,
          descrizione: prodotto.description,
          sconto: prodotto.discount,
          prezzo: prodotto.price,
          coloreP: prodotto.primaryColor,
          coloreS: prodotto.secondaryColor,
          sport: prodotto.sport,
          categoria: prodotto.is_clothing,
        }
      });
    }

    this.formService.getForm().patchValue({
      formDisponibilita:{
         quantitaXS: amountXS,
         quantitaS: amountS,
         quantitaM: amountM,
         quantitaL: amountL,
         quantitaXL: amountXL
      }
    })

  }
  sendReviewData(reviewData: ProductReview){
    const headers = this.keycloakService.permaHeader();
    return this.http.post<string>(this.addProductReviewURL, reviewData,{ headers, responseType: 'text' as 'json' });
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
    this.products = []

    this.getProductsFromServer().subscribe(response =>{
      this.products = response
      this.products.forEach(prod =>{
        this.getProductImage(prod.productId).subscribe(
          response => {
            const url = URL.createObjectURL(response);
            console.log("URL IMMAGINE: " + url)
            prod.image = this.sanitizer.bypassSecurityTrustUrl(url);
            console.log("IMMAGINE PRODOTTO: " + prod.image)
          },
          error => {
            console.error('Errore nel caricamento dell\'immagine', error);
          }
        );
      })
      this.router.navigate(['products-list']);
    })
  }

  setProductIdInCache(id: string){
    localStorage.setItem('productID', id);
  }

  getProductIdInCache() {
    const productID = localStorage.getItem('productID');
    if (productID) {
      return productID;
    } else {
      if(this.prodotto != null)
        return this.prodotto.id;
      return ""
    }
  }

  prendiDatiProdotto(productId: string) {
    this.imageUrl = undefined
    this.keycloakService.loading = true

    this.setProductIdInCache(productId)

    const headers = this.keycloakService.permaHeader()
    return this.http.get<ProductDTO>(this.productDataURL+'/'+productId, { headers}).subscribe(response =>{
      if(response != null){
        this.prodotto = response
        this.recensioni= []
        this.loadImage(this.prodotto.id)
        this.prendiRecensioni(productId, 0) .subscribe({
          next: (response: ProductReview[])=> {
            this.recensioni= response
            if(this.products.length > 0){
              this.products.forEach(p =>{
                if(p.productId===productId) {
                  this.mediaRecensioni= p.averageReview
                  this.numeroRecensioni=  p.reviewsNumber
                }
              })
            }
            if(this.offerProducts.length > 0){
              this.offerProducts.forEach(p =>{
                if(p.productId===productId) {
                  this.mediaRecensioni= p.averageReview
                  this.numeroRecensioni=  p.reviewsNumber
                }
              })
            }
            if(this.newProducts.length > 0){
              this.newProducts.forEach(p =>{
                if(p.productId===productId) {
                  this.mediaRecensioni= p.averageReview
                  this.numeroRecensioni=  p.reviewsNumber
                }
              })
            }

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

  avanzaRecensioni(){
    if(this.prodotto != null){
      this.prendiRecensioni(this.prodotto.id, this.numPagRec+1).subscribe(response => {
        if(response!=null) {
          response.forEach(res =>{
            this.recensioni.push(res)
          })
        }
      })
      this.prendiScoreRecensioni(this.prodotto.id).subscribe(response => {
        if(response!=null) {
          this.scoreRecensioni= response
        }
      })
    }
  }

  getProductImage(productId: string): Observable<Blob> {
    const headers = this.keycloakService.permaHeader()
    const customURL = this.manageImageProductURL+'/'+productId
    return this.http.get(customURL, {headers, responseType: 'blob' });
  }

  loadImage(id: string){
    this.getProductImage(id).subscribe(
      response => {
        const url = URL.createObjectURL(response);
        console.log("URL IMMAGINE: " + url)
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        console.log("IMMAGINE PRODOTTO: " + this.imageUrl)
      },
      error => {
        console.error('Errore nel caricamento dell\'immagine', error);
      }
    );
  }



  sendProductDate(productDTO: ProductDTO){
    this.sendProductDateToServer(productDTO).subscribe(
      response => {
        if(response != null)
          var uuid = response.replace(/"/g, "");
          if(this.selectedFile) {
            console.log("UFILEEEEEEEEEE" + this.selectedFile.name)
            this.uploadImage(this.selectedFile, uuid).subscribe(response => {
                if (response === "Immagine caricata con successo!") {
                  this.popUpService.updateStringa("Prodotto aggiunto o modificato con successo!")
                  this.popUpService.openPopups(103, true)
                  setTimeout(() => {
                    this.resetFields()
                    this.formService.resetFormErrors(this.formCaesarzon)
                    this.popUpService.closePopup()
                    this.router.navigate(['']);
                  }, 2000);
                  this.nuovoProdotto = true
                }
              },
              error => {
                this.nuovoProdotto = true
                this.popUpService.updateStringa("Problemi nell'aggiunta o modifica del prodotto.")
                this.popUpService.openPopups(1034, true)
                this.resetFields()
                console.error('Error sending product data:', error);
              }
            )
          }
      },
      error => {
        this.nuovoProdotto = true
        this.popUpService.updateStringa("Problemi nell'aggiunta o modifica del prodotto.")
        this.popUpService.openPopups(1034, true)
        this.resetFields()
        console.error('Error sending product data:', error);
      }
    );
  }



  sendProductDateToServer(productDTO: ProductDTO): Observable<any> {
    const headers = this.keycloakService.permaHeader()
    const customURL = this.productDataURL+'?new='+this.nuovoProdotto
    return this.http.post<string>(customURL, productDTO, { headers, responseType: 'text' as 'json' });
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

  prendiRecensioni(productId: string, num: number) {
    const headers = this.keycloakService.permaHeader()
    return this.http.get<ProductReview[]>(this.productReviewURL+'?prod-id='+productId+'&str='+num, { headers})
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
    this.selectedFile = null
    this.imageUrl = undefined
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
    this.products = []

    this.getProductsFromServer().subscribe(response => {
      this.products = response;
      this.products.forEach(prod =>{
        this.getProductImage(prod.productId).subscribe(
          response => {
            const url = URL.createObjectURL(response);
            prod.image = this.sanitizer.bypassSecurityTrustUrl(url);
          },
          error => {
            console.error('Errore nel caricamento dell\'immagine', error);
          }
        );
      })
      this.ricerca = this.ricerca.replace(this.sport, '');
      this.ricerca = this.ricerca.replace(this.colorePrimario, '');
      this.ricerca = this.ricerca.replace(this.coloreSecondario, '');
      this.ricerca = this.ricerca.replace(this.marca, '');
    });

  }


}


