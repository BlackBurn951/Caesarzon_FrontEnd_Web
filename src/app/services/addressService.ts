import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Address} from "../entities/Address";
import {KeyCloakService} from "./keyCloakService";
import {FormGroup} from "@angular/forms";
import {FormService} from "./formService";
import {City} from "../entities/City";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  formCaesarzon!: FormGroup;

  private getAddressURL = 'http://localhost:8090/user-api/address';

  private sendAddressURL = 'http://localhost:8090/user-api/address';

  constructor(private http: HttpClient, private keycloak: KeyCloakService, private formService: FormService) {
    this.formCaesarzon = formService.getForm();
  }


  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.getAddressURL);
  }

  sendAddress(){
    const indirizzoForm =  this.formCaesarzon.get("formIndirizzo");
    const tipoStrada = indirizzoForm?.get("tipologiaStrada")?.value;
    const nomeStrada = indirizzoForm?.get("nomeStrada")?.value;
    const numeroCivico = indirizzoForm?.get("numeroCivico")?.value;
    const citta = indirizzoForm?.get("citta")?.value;
    const cap = indirizzoForm?.get("cap")?.value;
    const provincia = indirizzoForm?.get("provincia")?.value;
    const regione = indirizzoForm?.get("regione")?.value;
    const id = indirizzoForm?.get("id")?.value;

    console.log(id);
    console.log(nomeStrada);
    console.log(numeroCivico);
    console.log(tipoStrada);


    const city: City = {
      id: id,
      city: citta,
      cap: cap,
      region: regione,
      province: provincia,
    }

    const addressData: Address = {
      id: 1,
      roadType: tipoStrada,
      roadName: nomeStrada,
      houseNumber: numeroCivico,
      city: city

    };

    this.sendAddressData(addressData).subscribe(
      response => {
        console.log('Address data sent successfully:', response);
      },
      error => {
        console.error('Error sending address data:', error);
      }
    );
  }


  sendAddressData(addressData: Address): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloak.getAccessToken() });
    return this.http.post<any>(this.sendAddressURL, addressData, {headers});
  }
}
