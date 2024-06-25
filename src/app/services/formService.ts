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


  //Creazione dei vari form utili al funzionamento del sito
  createForm() {
    this.formCaesarzon = this.fb.group({
      formDeiProdotti: this.buildFormProdotti(),
      formRegistrazione: this.buildFormRegistrazione(),
      formIndirizzo: this.buildFormIndirizzo(),
      formCarta: this.buildFormCarte(),
      formDatipersonali: this.buildFormDatiPersonali(),
      formDisponibilita: this.buildFormDisponibilita()
    })

  }

  //Metodo per prendere il form
  getForm() {
    return this.formCaesarzon;
  }

  //Metodo per la creazione del form dei prodotti
  private buildFormProdotti():FormGroup{
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      marca: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      descrizione: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      sconto: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      prezzo: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
      coloreP: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      coloreS: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      sport: ['', [Validators.required, Validators.minLength(4) , Validators.maxLength(20)]],
      categoria: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]]
    });
  }

  //Metodo per la creazione del form della registrazione
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

  private buildFormDisponibilita():FormGroup{
    return this.fb.group({
      quantitaXS: ['', [Validators.required, Validators.min(10), Validators.max(200)]],
      quantitaS: ['', [Validators.required, Validators.min(10), Validators.max(200)]],
      quantitaM: ['', [Validators.required, Validators.min(10), Validators.max(200)]],
      quantitaL: ['', [Validators.required, Validators.min(10), Validators.max(200)]],
      quantitaXL: ['', [Validators.required, Validators.min(10), Validators.max(200)]],
    });
  }



  //Metodo per la creazione del form dei dati personali
  private buildFormDatiPersonali():FormGroup{
    return this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{2,}( [a-zA-Z]{2,30})?$/)]],
      cognome: ['', [Validators.required,  Validators.pattern(/^[a-zA-Z]{2,}( [a-zA-Z]{2,30})?$/)]],
      username: [''],
      email: ['', [Validators.required, Validators.email, this.validaDominioConosciuto.bind(this)]],
      cellulare: [''],

    });
  }

  //Metodo per la creazione del form dell'aggiunta dell'indirizzo
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

  //Metodo per la creazione del form dell'aggiunta della carta
  private buildFormCarte():FormGroup {
    return this.fb.group({
      numeroCarta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      titolareCarta: ['', [Validators.required, Validators.pattern(/^(?=.{5,40}$)[a-zA-Z]+( [a-zA-Z]+){0,3}$/)]],
      dataScadenza: ['', [Validators.required, this.expirationDateValidator]],
      cvv:  ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  //Metodo per la validazione dei campi
  campoNonCorretto(fieldName: string) {
    const fieldControl = this.formCaesarzon.get(fieldName);
    return fieldControl?.invalid && (fieldControl?.dirty || fieldControl?.touched);
  }

  //Metodo per la validazione del dominio dell'email+
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

  //Metodo per la validazione della data di scadenza
  expirationDateValidator(control: any): { [key: string]: boolean } | null {
    if (control.value) {
      const [year, month] = control.value.split('-').map((val: string) => parseInt(val, 10));
      if (!this.isExpirationDateValid(month, year)) {
        return { 'invalidDate': true };
      }
    }
    return null;
  }

  //Metodo per la validazione della data di scadenza
  isExpirationDateValid(month: number, year: number): boolean {
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

}


