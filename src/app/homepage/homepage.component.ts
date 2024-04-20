import {Component} from '@angular/core';
import {Router} from "@angular/router";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})



export class HomepageComponent {
  products: any[] = [];
  showDetails: boolean = false;
  constructor(private router: Router) {
    this.products = [
      { id: 1, name: 'Prodotto 1', description: 'Il prodotto 1 è un prodotto di orginie italiana, lavorato nell'+'azienza X' },
      { id: 2, name: 'Prodotto 2', description: 'Descrizione breve del prodotto 2' },
      { id: 3, name: 'Prodotto 3', description: 'Descrizione breve del prodotto 3' }
    ];
  }



  goToProductPage(event: MouseEvent) {
    this.router.navigate(['product-page'])
    event.preventDefault()
  }

  initSlider(dir: string, idSlideWrapper: string) {

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

  }
  toggleDetails(){
    this.showDetails = !this.showDetails;
    console.log(this.showDetails)
  }
}
