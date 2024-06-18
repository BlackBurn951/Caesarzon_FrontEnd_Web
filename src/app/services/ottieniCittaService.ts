import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormGroup} from "@angular/forms";
import {FormService} from "./formService";
import {CityDataSuggest} from "../entities/CityDataSuggest";
import {KeyCloakService} from "./keyCloakService";


@Injectable({
  providedIn: 'root',
})
export class ottieniCittaService {


  private urlOttieniCitta = 'http://localhost:8090/user-api/city';

  private urlOttieniCapProvReg = 'http://localhost:8090/user-api/city-data';

  public suggerimentiCitta: string[] = [];

  public datiCitta!: CityDataSuggest;

  myForm!: FormGroup;



  constructor(private keycloakService: KeyCloakService, private http: HttpClient, private formService: FormService) {
    this.myForm = this.formService.getForm();

  }

  //Metodo per ottenere la lista di città suggerite
  public ottienSuggerimentiCitta(sugg: string){
    const headers = this.keycloakService.permaHeader()
    return this.http.get<string[]>(`${this.urlOttieniCitta}?sugg=${sugg}`, { headers });
  }
  public ottieniCitta(sugg: string) {
    this.ottienSuggerimentiCitta(sugg).subscribe((citta: string[]) => {
      this.suggerimentiCitta = citta;
    });
  }

  //Metodo per ottenere i dati della città selezionata
  public ottieniAltriDatiCitta(city: string){
    const headers = this.keycloakService.permaHeader()
    return this.http.get<CityDataSuggest>(`${this.urlOttieniCapProvReg}?city=${city}`, { headers });
  }
  public ottieniDatiCitta(datiC: string) {
    this.ottieniAltriDatiCitta(datiC).subscribe((dati: CityDataSuggest) => {
      this.datiCitta = dati;
      this.patchValue();
    });

  }


  //Metodo per assegnare i dati ricevuti al form
  private patchValue(){
  const formGroup = this.myForm.get("formIndirizzo") as FormGroup;
  formGroup.patchValue({
    id: this.datiCitta.id,
    cap: this.datiCitta.cap,
    provincia: this.datiCitta.province,
    regione: this.datiCitta.region
  });
}


  //Al cambio della città vengono caricati i rispettivi dati
  public onCittaChange(cittaSelezionata: string) {
    const indirizzoControl = this.myForm.get(`formIndirizzo.citta`);
    if (indirizzoControl) {
      this.ottieniDatiCitta(cittaSelezionata);
    }


  }
}
