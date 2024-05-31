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

  private indirizzoCorrente: string = '';


  constructor(private keycloak: KeyCloakService, private http: HttpClient, private formService: FormService) {
    this.myForm = this.formService.getForm();

  }

  private createHeaders() {
    const token = this.keycloak.getAccessToken();  // Replace 'your-token-here' with your actual token
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  public ottienSuggerimentiCitta(sugg: string){
    const headers = this.createHeaders();
    return this.http.get<string[]>(`${this.urlOttieniCitta}?sugg=${sugg}`, { headers });
  }

  public ottieniCitta(sugg: string, formGroupName: string) {
    this.ottienSuggerimentiCitta(sugg).subscribe((citta: string[]) => {
      this.suggerimentiCitta = citta;
      this.setIndirizzoCorrente(formGroupName);
    });
  }

  private setIndirizzoCorrente(formGroupName: string) {
    if (formGroupName === 'R') {
      this.indirizzoCorrente = 'indirizzo';
    }

  }

  public ottieniAltriDatiCitta(city: string){
    const headers = this.createHeaders();
    return this.http.get<CityDataSuggest>(`${this.urlOttieniCapProvReg}?city=${city}`, { headers });
  }

  public ottieniDatiCitta(datiC: string) {
    this.ottieniAltriDatiCitta(datiC).subscribe((dati: CityDataSuggest) => {
      this.datiCitta = dati;
      this.patchValueForCurrentIndirizzo();
    });
  }

  private patchValueForCurrentIndirizzo() {
    const currentFormGroup = this.myForm.get(this.indirizzoCorrente) as FormGroup;
    if (this.indirizzoCorrente === 'indirizzo') {
      this.patchValueForIndirizzo(currentFormGroup);
    }

    this.indirizzoCorrente = '';
  }


  private patchValueForIndirizzo(formGroup: FormGroup) {
    formGroup.patchValue({
      cap: this.datiCitta.cap,
      provincia: this.datiCitta.province,
      regione: this.datiCitta.region
    });

  }



  public onCittaChange(cittaSelezionata: string) {

    if (this.indirizzoCorrente === 'indirizzo') {
      const indirizzoControl = this.myForm.get(`${this.indirizzoCorrente}.citta`);
      if (indirizzoControl) {
        indirizzoControl.patchValue(cittaSelezionata);
        this.ottieniDatiCitta(cittaSelezionata);
      }
    }

  }
}
