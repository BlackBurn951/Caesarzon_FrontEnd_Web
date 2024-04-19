import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  goToHomepage(id: number) {
    this.router.navigate(['/homepage/']);
  }

  reload(event: Event): void {
    window.location.reload()
    event.preventDefault()
  }
}
