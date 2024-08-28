import {Injectable, OnInit} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
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
export class AddressService implements OnInit{

  ngOnInit(): void {
  }

  indirizzoCorrente: Address | null = null;

  addressesName: string[] = [];

  addresses: Address[] = [];

  addressMap: { [key: string]: string } = {};

  nomeIndirizzo: string = ""

  formCaesarzon!: FormGroup;

  private manageAddressURL = 'http://localhost:8090/user-api/address';

  private getAddressNamesURL = 'http://localhost:8090/user-api/addresses';


  constructor(private userService: UserService, private router: Router, private popUp: PopupService, private http: HttpClient, private keycloakService: KeyCloakService, private formService: FormService) {
    this.formCaesarzon = formService.getForm();
  }


  resetAddresses(){
    this.addressesName = []
    this.addresses = []
    this.addressMap = {}
  }


  //Metodo per prendere il singolo indirizzo
  getAddress(idAddress: string): Observable<Address> {
    const urlWithParams = `${this.manageAddressURL}?address_id=${idAddress}`;
    const headers = this.keycloakService.permaHeader()
    return this.http.get<Address>(urlWithParams, { headers });
  }

  getAddressesNamePayment() {
    const headers = this.keycloakService.permaHeader();

    this.http.get<string[]>(this.getAddressNamesURL, { headers }).subscribe({
      next: (response) => {
        console.log("Address id: " + response);
        this.addressesName = response;

        // Creo un array di observable per ogni chiamata a getAddress
        const requests = this.addressesName.map(addr => this.getAddress(addr));

        // Utilizzo forkJoin per eseguire tutte le richieste in parallelo
        forkJoin(requests).subscribe(
          (addresses: Address[]) => {
            console.log("Addresses fetched:", addresses);
            this.addresses = addresses; // Assegno tutti gli indirizzi alla lista addresses
          },
          (error) => {
            console.error('Error fetching addresses:', error);
          }
        );
      },
      error: (error) => {
        console.error('Error fetching address names:', error);
      }
    });
  }


  //Metodo per prende la lista degli indirizzi dell'utente
  getAddressesName() {
    const headers = this.keycloakService.permaHeader();
    let urlWithParams;
    if (this.keycloakService.getAdmin()) {
      urlWithParams = this.getAddressNamesURL+'/'+this.keycloakService.getUsername()
    }else{
      urlWithParams = this.getAddressNamesURL
    }

    //TODO DA PROVARE
    this.http.get<string[]>(urlWithParams, { headers }).subscribe({
      next: (response) => {
        this.addressesName = response;
        this.generateAddressMap();

        this.nomeIndirizzo = this.addressesName[0];

        if (this.addressesName.length > 0) {
          this.getAddress(this.addressesName[0]).subscribe({
            next: (response: Address) => {
              this.userService.loading = false;
              this.indirizzoCorrente = response;
              this.router.navigate(['address-data']);
            },
            error: (error: any) => {
              this.userService.loading = false;
              if (error.status === 404) {
                this.router.navigate(['address-data']);
              } else {
                this.userService.loading = false;
                console.error('Error fetching address:', error);
              }
            }
          });
        }else{
          this.userService.loading = false
          this.router.navigate(['address-data']);

        }
      },
      error: (error) => {
        console.error('Error fetching address names:', error);
      }
    });
  }

  generateAddressMap() {
    this.addressMap = {};
    this.addressesName.forEach((addressId, index) => {
      this.addressMap[addressId] = `Indirizzo ${index + 1}`;
    });
  }


  //Metodo per eliminare l'indirizzo attualmente selezionato
  deleteAddress(){
    const urlWithParams = `${this.manageAddressURL}?address_id=${this.nomeIndirizzo}`;
    const headers = this.keycloakService.permaHeader()

    this.http.delete<string>(urlWithParams, { headers , responseType: 'text' as 'json' })
      .subscribe({
        next: (response) => {
          this.popUp.updateStringa(response)
          this.popUp.openPopups(104, true)
          this.clearFields()
          setTimeout(()=>{
            window.location.reload()
          }, 1500);

        },
        error: (error) => {
          console.error('Errore durante l\'eliminazione dell\'indirizzo:', error);
        }
      });
  }


  //Metodo per inviare al server i dati di un indirizzo e aggiungerlo
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
      id: "",
      roadType: tipoStrada,
      roadName: nomeStrada,
      houseNumber: numeroCivico,
      city: city
    };

    this.sendAddressData(addressData).subscribe(
      response => {
        this.popUp.closePopup()
        this.popUp.updateStringa("Indirizzo aggiunto con successo!")
        this.popUp.openPopups(134, true)
        this.clearFields()
        setTimeout(()=>{
          window.location.reload()
        }, 2000);
      },
      error => {
        this.popUp.closePopup()
        this.popUp.updateStringa("Errore nell'aggiunta dell'indirizzo!")
        this.popUp.openPopups(1234, true)
        this.clearFields()
      }
    );
  }

  sendAddressData(addressData: Address): Observable<string> {
    const headers = this.keycloakService.permaHeader()
    if (this.keycloakService.getAdmin()) {
    const customURL = this.manageAddressURL + '/' + this.keycloakService.getUsername()
    return this.http.post(customURL, addressData, {headers, responseType: 'text'}) as Observable<string>;
    }
    else{
      return this.http.post(this.manageAddressURL, addressData, { headers, responseType: 'text' }) as Observable<string>;
    }

  }

  //Metodo per pulire i campi
  clearFields(){
    const formIndirizzo = this.formCaesarzon.get('formIndirizzo') as FormGroup;
    formIndirizzo.patchValue({
      id: '',
      tipologiaStrada: '',
      nomeStrada: '',
      numeroCivico: '',
      citta: '',
      cap: '',
      provincia: '',
      regione: '',

    });
    this.formService.resetFormErrors(formIndirizzo)

  }



}
