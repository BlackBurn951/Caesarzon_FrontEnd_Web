import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { Address } from "../entities/Address";
import { KeyCloakService } from "./keyCloakService";
import { FormGroup } from "@angular/forms";
import { FormService } from "./formService";
import { City } from "../entities/City";
import {PopupService} from "./popUpService";
import {Router} from "@angular/router";
import {UserService} from "./userService";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  indirizzoCorrente!: Address;

  addressesName!: string[];

  nomeIndirizzo!: string;

  formCaesarzon!: FormGroup;

  private manageAddressURL = 'http://localhost:8090/user-api/address';

  private getAddressNamesURL = 'http://localhost:8090/user-api/addresses-names';


  constructor(private userService: UserService, private router: Router, private popUp: PopupService, private http: HttpClient, private keycloak: KeyCloakService, private formService: FormService) {
    this.formCaesarzon = formService.getForm();
  }

  getAddresses(nameLista: string): Observable<Address> {
    const urlWithParams = `${this.manageAddressURL}?nameLista=${nameLista}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.keycloak.getAccessToken()
    });
    return this.http.get<Address>(urlWithParams, { headers });
  }

  getAddressesName() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.keycloak.getAccessToken()
    });
    this.http.get<string[]>(this.getAddressNamesURL, { headers }).subscribe({
      next: (response) => {
        this.addressesName = response;

        if (this.addressesName.length > 0) {
          this.nomeIndirizzo = "Indirizzo 1"
          this.getAddresses(this.addressesName[0]).subscribe({
            next: (response: Address) => {
              this.userService.loading = false;
              this.indirizzoCorrente = response
              this.router.navigate(['address-data']);
            },
            error: (error: any) => {
              if (error.status === 404) {
                this.userService.loading = false;
                this.router.navigate(['address-data']);
              } else {
                this.userService.loading = false;
                console.error('Error fetching card:', error);
              }
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching address names:', error);
      }
    });
  }

  deleteAddress(){
    const urlWithParams = `${this.manageAddressURL}?addr=${this.nomeIndirizzo}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.keycloak.getAccessToken()
    });

    this.http.delete<string>(urlWithParams, { headers , responseType: 'text' as 'json' })
      .subscribe({
        next: (response) => {
          console.log('Indirizzo eliminato con successo:', response);
          this.popUp.updateStringa(response)
          this.popUp.openPopups(10, true)
          setTimeout(()=>{
            window.location.reload()

          }, 1000);

        },
        error: (error) => {
          console.error('Errore durante l\'eliminazione dell\'indirizzo:', error);
        }
      });
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
        this.popUp.openPopups(10, true)
        this.clearFields()
        window.location.reload()
      },
      error => {
        this.popUp.closePopup()
        this.popUp.updateStringa("Errore nell'aggiunta dell'indirizzo!")
        this.popUp.openPopups(10, true)
        this.clearFields()
      }
    );
  }

  sendAddressData(addressData: Address): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.keycloak.getAccessToken() });
    return this.http.post(this.manageAddressURL, addressData, { headers, responseType: 'text' }) as Observable<string>;
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
