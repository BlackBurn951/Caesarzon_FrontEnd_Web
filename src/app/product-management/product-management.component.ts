import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css', '../../styles.css']
})
export class ProductManagementComponent {
  prodottoForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.prodottoForm = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      descrizione: ['', Validators.required],
      sconto: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      quantita: ['', [Validators.required, Validators.min(0)]],
      prezzo: ['', [Validators.required, Validators.min(0)]],
      coloreP: ['', Validators.required],
      coloreS: ['', Validators.required],
      taglia: ['none', Validators.required],
      sport: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  aggiungiProdotto() {
    // Implementazione per aggiungere il prodotto
  }

  get form() {
    return this.prodottoForm.controls;
  }

}
