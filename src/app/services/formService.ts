import { Injectable } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PopupService} from "./popUpService";
import { dominiEmailComuni } from '../domini-email-comuni';

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
      formCarta: this.buildFormPagamento(),
      formDatipersonali: this.buildFormDatiPersonali()
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
      nome: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{2,}( [a-zA-Z]{2,30})?$/)]],
      cognome: ['', [Validators.required,  Validators.pattern(/^[a-zA-Z]{2,}( [a-zA-Z]{2,30})?$/)]],
      username: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z])[a-zA-Z0-9]{5,20}$/)]],
      email: ['', [Validators.required, Validators.email, this.validaDominioConosciuto.bind(this)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^?&*()_+]{8,20}$/)]],
      confermaPassword: ['', Validators.required],
    });
  }

  private buildFormDatiPersonali():FormGroup{
    return this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{2,}( [a-zA-Z]{2,30})?$/)]],
      cognome: ['', [Validators.required,  Validators.pattern(/^[a-zA-Z]{2,}( [a-zA-Z]{2,30})?$/)]],
      username: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z])[a-zA-Z0-9]{5,20}$/)]],
      email: ['', [Validators.required, Validators.email, this.validaDominioConosciuto.bind(this)]],
      cellulare: [''],

    });
  }

  private buildFormIndirizzo():FormGroup{
    return this.fb.group({
      id: [''],
      tipologiaStrada:  ['',Validators.required],
      nomeStrada:  ['', [Validators.required, Validators.pattern(/^(?=(?:.*[a-zA-Z]){2,})[a-zA-Z0-9 ]{2,30}$/)]],
      numeroCivico:  ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]{1,8}$/)]],
      citta:  ['',Validators.required],
      cap:  ['',Validators.required],
      provincia:  ['',Validators.required],
      regione:  ['',Validators.required],

    });
  }

  private buildFormPagamento():FormGroup {
    return this.fb.group({
      numeroCarta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      titolareCarta: ['', [Validators.required, Validators.pattern(/^(?=.{5,40}$)[a-zA-Z]+( [a-zA-Z]+){0,3}$/)]],
      dataScadenza: ['', [Validators.required, this.expirationDateValidator]],
      cvv:  ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
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

  expirationDateValidator(control: any): { [key: string]: boolean } | null {
    if (control.value) {
      const [year, month] = control.value.split('-').map((val: string) => parseInt(val, 10));
      if (!isExpirationDateValid(month, year)) {
        return { 'invalidDate': true };
      }
    }
    return null;
  }
}

function isExpirationDateValid(month: number, year: number): boolean {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  if (year < currentYear) {
    return false;
  } else if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;


}
