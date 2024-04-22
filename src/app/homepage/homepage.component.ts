import {Component} from '@angular/core';
import {Router} from "@angular/router";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})



export class HomepageComponent {
  products: any[] = [];
  products2: any[] = [];
  products3: any[] = [];
  showDetails: boolean = false;
  indexNovita = 0;
  indexOfferte: number = 0;
  indexMomento: number = 0;
  constructor(private router: Router) {
    this.products = [
      { id: 1, name: 'Prodotto 1', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza X' },
      { id: 2, name: 'Prodotto 2', description: 'Descrizione breve del prodotto 2' },
      { id: 3, name: 'Prodotto 3', description: 'Descrizione breve del prodotto 3' },
      { id: 4, name: 'Prodotto 4', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 5, name: 'Prodotto 5', description: 'Descrizione breve del prodotto 5' },
      { id: 6, name: 'Prodotto 6', description: 'Descrizione breve del prodotto 6' },
      { id: 7, name: 'Prodotto 7', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 8, name: 'Prodotto 8', description: 'Descrizione breve del prodotto 5' },
      { id: 9, name: 'Prodotto 9', description: 'Descrizione breve del prodotto 6' },
      { id: 7, name: 'Prodotto 10', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 8, name: 'Prodotto 11', description: 'Descrizione breve del prodotto 5' },
      { id: 9, name: 'Prodotto 12', description: 'Descrizione breve del prodotto 6' }
    ];
    this.products2 = [
      { id: 1, name: 'Prodotto 1', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza X' },
      { id: 2, name: 'Prodotto 2', description: 'Descrizione breve del prodotto 2' },
      { id: 3, name: 'Prodotto 3', description: 'Descrizione breve del prodotto 3' },
      { id: 4, name: 'Prodotto 4', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 5, name: 'Prodotto 5', description: 'Descrizione breve del prodotto 5' },
      { id: 6, name: 'Prodotto 6', description: 'Descrizione breve del prodotto 6' },
      { id: 7, name: 'Prodotto 7', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 8, name: 'Prodotto 8', description: 'Descrizione breve del prodotto 5' },
      { id: 9, name: 'Prodotto 9', description: 'Descrizione breve del prodotto 6' },
      { id: 7, name: 'Prodotto 10', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 8, name: 'Prodotto 11', description: 'Descrizione breve del prodotto 5' },
      { id: 9, name: 'Prodotto 12', description: 'Descrizione breve del prodotto 6' }
    ];
    this.products3 = [
      { id: 1, name: 'Prodotto 1', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza X' },
      { id: 2, name: 'Prodotto 2', description: 'Descrizione breve del prodotto 2' },
      { id: 3, name: 'Prodotto 3', description: 'Descrizione breve del prodotto 3' },
      { id: 4, name: 'Prodotto 4', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 5, name: 'Prodotto 5', description: 'Descrizione breve del prodotto 5' },
      { id: 6, name: 'Prodotto 6', description: 'Descrizione breve del prodotto 6' },
      { id: 7, name: 'Prodotto 7', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 8, name: 'Prodotto 8', description: 'Descrizione breve del prodotto 5' },
      { id: 9, name: 'Prodotto 9', description: 'Descrizione breve del prodotto 6' },
      { id: 7, name: 'Prodotto 10', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza Y' },
      { id: 8, name: 'Prodotto 11', description: 'Descrizione breve del prodotto 5' },
      { id: 9, name: 'Prodotto 12', description: 'Descrizione breve del prodotto 6' }
    ];
  }


    goToProductPage(event: Event) {
    this.router.navigate(['product-page'])
      event.preventDefault();
  }

  nextData(id: string) {

    if(id === 'novita'){
      console.log('sono in novità')
      if (this.products.length === 0)
        return;

      const numVisibleProducts = 3; // Numero di prodotti visibili alla volta

      if (this.indexNovita < this.products.length - numVisibleProducts) {
        this.indexNovita += 1;
      }
    }

    if(id === 'offerte'){
      if (this.products.length === 0)
        return;

      const numVisibleProducts = 3; // Numero di prodotti visibili alla volta

      if (this.indexOfferte < this.products2.length - numVisibleProducts) {
        this.indexOfferte += 1;
      }
    }

    if(id === 'prodottiDelMomento'){
      if (this.products.length === 0)
        return;

      const numVisibleProducts = 3; // Numero di prodotti visibili alla volta

      if (this.indexMomento  < this.products3.length - numVisibleProducts) {
        this.indexMomento  += 1;
      }
    }
  }


  previusData(id: string){
    if(id === 'novita'){
      if (this.products.length === 0)
        return;

      if (this.indexNovita >0) {
        this.indexNovita -= 1;
      }
    }

    if(id === 'offerte'){
      if (this.products2.length === 0)
        return;

      if (this.indexOfferte > 0) {
        this.indexOfferte -= 1;
      }
    }

    if(id === 'prodottiDelMomento'){
      if (this.products3.length === 0)
        return;

      if (this.indexMomento > 0) {
        this.indexMomento -= 1;
      }
    }
  }


  /*initSlider(dir: string, idSlideWrapper: string) {

    const sliderWrapper = document.getElementById(idSlideWrapper);
    if (!sliderWrapper) {
      console.error("Nessun elemento trovato con l'ID specificato");
      return;
    }
    const cardList = sliderWrapper.querySelector('.card-list');
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");

    if (!cardList) {
      console.error("Nessun elemento trovato con la classe 'card-list'");
      return;
    }

   const cardWidth = cardList.querySelector('.card')?.clientWidth ?? 0;
    slideButtons.forEach(button => {
      button.addEventListener('click', () => {
        const direction = dir === "prev" ? -1 : 1;
        let scrollAmount = cardList.clientWidth * 3 * direction;
        cardList.scrollBy({ left: scrollAmount, behavior: `smooth` });
      });
    });

  }*/
  toggleDetails(){
    this.showDetails = !this.showDetails;
    console.log(this.showDetails)
  }
}
