import {Component,OnInit} from '@angular/core';
import { PopupService } from "../services/popUpService";
import {Address} from "../entities/Address";
import {AddressService} from "../services/addressService";
import {KeyCloakService} from "../services/keyCloakService";
import {Event} from "@angular/router";
import {EventData} from "@angular/cdk/testing";

@Component({
  selector: 'app-user-address-data',
  templateUrl: './user-address-data.component.html',
  styleUrls: ['./user-address-data.component.css', '../../styles.css']
})
export class UserAddressDataComponent implements OnInit{


  constructor(
    public popUpService: PopupService,
    protected addressService: AddressService,
    private keyCloak: KeyCloakService
  ) { }

  ngOnInit() {
    this.addressService.getAddressesName()
    this.keyCloak.getNotify().subscribe(notifies => {
      this.keyCloak.notifications = notifies;
    })

  }


  loadAddresses(nameLista: string): void {
    this.addressService.getAddress(nameLista).subscribe(
      (data: Address) => {
        this.addressService.indirizzoCorrente = data;
      },
      (error: any) => {
        console.error('Errore nel caricamento degli indirizzi', error);
      }
    );
  }

  deleteAddr(){
    this.popUpService.operazione = 1
    this.popUpService.updateStringa("Sei sicuro di voler eliminare: " + this.addressService.addressMap[this.addressService.nomeIndirizzo] + "?")
    this.popUpService.openPopups(104, false);
  }



  onAddressChange(event: any): void {
    const selectedAddress = (event.target as HTMLSelectElement).value;
    this.addressService.nomeIndirizzo = selectedAddress;
    this.loadAddresses(selectedAddress);
  }


}
