import {Component, OnInit} from '@angular/core';
import { PopupService } from "../services/popUpService";
import {Address} from "../entities/Address";
import {AddressService} from "../services/addressService";

@Component({
  selector: 'app-user-address-data',
  templateUrl: './user-address-data.component.html',
  styleUrls: ['./user-address-data.component.css', '../../styles.css']
})
export class UserAddressDataComponent implements OnInit{


  constructor(
    public popUpService: PopupService,
    protected addressService: AddressService,
  ) { }

  ngOnInit() {
    this.addressService.getAddressesName()
  }


  loadAddresses(nameLista: string): void {
    this.addressService.getAddresses(nameLista).subscribe(
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
    this.popUpService.openPopups(12, false);
  }



  onAddressChange(event: Event): void {
    const selectedAddress = (event.target as HTMLSelectElement).value;
    this.addressService.nomeIndirizzo = selectedAddress
    this.loadAddresses(selectedAddress);

  }



}
