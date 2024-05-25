import { Injectable } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PopupService} from "./popUpService";
import { dominiEmailComuni } from './domini-email-comuni';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  private dominiEmailComuni = dominiEmailComuni;

  datiForm: any = {};


  protected formCaesarzon!: FormGroup;

  constructor(private fb: FormBuilder, private popUpService: PopupService) {
    this.createForm();
  }

  setFormData(formData: any) {
    this.datiForm = { ...this.datiForm, ...formData };
  }


  getFormData() {
    return this.datiForm;
  }

  createForm() {
    this.formCaesarzon = this.fb.group({
      formDeiProdotti: this.buildFormProdotti(),
      formRegistrazione: this.buildFormRegistrazione(),
      formIndirizzo: this.buildFormIndirizzo(),
      formPagamento: this.buildFormPagamento()
    })

  }

  getForm() {
    return this.formCaesarzon;
  }

  private buildFormProdotti():FormGroup{
    return this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      descrizione: ['', Validators.required],
      sconto: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      quantita: ['', [Validators.required, Validators.min(0), Validators.max(200)]],
      prezzo: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
      coloreP: ['', Validators.required],
      coloreS: ['', Validators.required],
      taglia: ['none', Validators.required],
      sport: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  private buildFormRegistrazione():FormGroup{
    return this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.validaDominioConosciuto.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)]],
      confermaPassword: ['', Validators.required],
    });
  }

  private buildFormIndirizzo():FormGroup{
    return this.fb.group({
      via:  ['',Validators.required],
      citta:  ['',Validators.required],
      stato:  ['',Validators.required],
      cap:  ['',Validators.required],
    });
  }

  private buildFormPagamento():FormGroup {
    return this.fb.group({
      numeroCarta: ['', Validators.required],
      titolareCarta: ['', Validators.required],
      dataScadenza: ['', Validators.required],
      cvv:  ['', Validators.required],
    });
  }

  campoNonCorretto(fieldName: string) {
    const fieldControl = this.formCaesarzon.get(fieldName);
    return fieldControl?.invalid && (fieldControl?.dirty || fieldControl?.touched);
  }

  validaDominioConosciuto(control: AbstractControl) {
    const email = control.value as string;

    if (!email || !email.includes('@')) {
      return { invalidEmailFormat: true };
    }

    const dominio = email.split('@')[1];

    if (!this.dominiEmailComuni.includes(dominio)) {
      return { dominioSconosciuto: true };
    }

    return null;
  }


}
