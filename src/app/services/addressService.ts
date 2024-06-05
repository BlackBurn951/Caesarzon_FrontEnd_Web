import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from "../entities/Address";
import { KeyCloakService } from "./keyCloakService";
import { FormGroup } from "@angular/forms";
import { FormService } from "./formService";
import { City } from "../entities/City";
import {PopupService} from "./popUpService";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  formCaesarzon!: FormGroup;

  private getAddressURL = 'http://localhost:8090/user-api/address';

  private sendAddressURL = 'http://localhost:8090/user-api/address';

  constructor(private popUp: PopupService, private http: HttpClient, private keycloak: KeyCloakService, private formService: FormService) {
    this.formCaesarzon = formService.getForm();
  }

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.getAddressURL);
  }

  sendAddress() {
    const indirizzoForm = this.formCaesarzon.get("formIndirizzo");
    const tipoStrada = indirizzoForm?.get("tipologiaStrada")?.value;
    const nomeStrada = indirizzoForm?.get("nomeStrada")?.value;
    const numeroCivico = indirizzoForm?.get("numeroCivico")?.value;
    const citta = indirizzoForm?.get("citta")?.value;
    const cap = indirizzoForm?.get("cap")?.value;
    const provincia = indirizzoForm?.get("provincia")?.value;
    const regione = indirizzoForm?.get("regione")?.value;
    const id = indirizzoForm?.get("id")?.value;

    const city: City = {
      id: id,
      city: citta,
      cap: cap,
      region: regione,
      province: provincia,
    }

    const addressData: Address = {
      id: null,
      roadType: tipoStrada,
      roadName: nomeStrada,
      houseNumber: numeroCivico,
      city: city
    };

    this.sendAddressData(addressData).subscribe(
      response => {
        this.popUp.closePopup()
        this.popUp.updateStringa("Indirizzo aggiunto con successo!")
        this.popUp.openPopups(9, true)
        this.clearFields()
      },
      error => {
        this.popUp.closePopup()
        this.popUp.updateStringa("Errore nell'aggiunta dell'indirizzo!")
        this.popUp.openPopups(9, true)
        this.clearFields()
      }
    );
  }

  sendAddressData(addressData: Address): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloak.getAccessToken() });
    return this.http.post(this.sendAddressURL, addressData, { headers, responseType: 'text' }) as Observable<string>;
  }

  clearFields(){
    const formCarta = this.formCaesarzon.get('formIndirizzo') as FormGroup;
    formCarta.patchValue({
      id: '',
      tipologiaStrada: '',
      nomeStrada: '',
      numeroCivico: '',
      citta: '',
      cap: '',
      provincia: '',
      regione: '',

    });
  }

}
