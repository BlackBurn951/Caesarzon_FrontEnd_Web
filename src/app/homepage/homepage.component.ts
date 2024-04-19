import {Component, ElementRef} from '@angular/core';
import {RegistrationComponent} from "../registration/registration.component";
import {MatDialog} from "@angular/material/dialog";
import {Event, NavigationEnd, Router} from "@angular/router";
import {LoginService} from "../loginService";
import {ProductPageComponent} from "../product-page/product-page.component";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})


export class HomepageComponent {
  products: any[] = [];
  constructor(private router: Router) {
    this.products = [
      { id: 1, name: 'Prodotto 1', description: 'Descrizione breve del prodotto 1' },
      { id: 2, name: 'Prodotto 2', description: 'Descrizione breve del prodotto 2' },
      { id: 3, name: 'Prodotto 3', description: 'Descrizione breve del prodotto 3' }
    ];
  }



  goToProductPage(event: MouseEvent) {
    this.router.navigate(['product-page'])
    event.preventDefault()
  }

  initSlider() {
    const cardList = document.querySelector('.slider-wrapper .card-list');
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");

    if (!cardList) {
      console.error("Nessun elemento trovato con la classe 'card-list'");
      return;
    }

    const cardWidth = cardList.querySelector('.card')?.clientWidth ?? 0;
    slideButtons.forEach(button => {
      button.addEventListener('click', () => {
        const direction = button.id === "prev-slide" ? -1 : 1;
        let scrollAmount = cardList.clientWidth * 3 * direction;
        cardList.scrollBy({ left: scrollAmount, behavior: `smooth` });
      });
    });
  }




}
