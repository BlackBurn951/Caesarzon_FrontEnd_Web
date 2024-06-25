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



  onAddressChange(event: Event): void {
    const selectedAddress = (event.target as HTMLSelectElement).value;
    this.loadAddresses(selectedAddress);

  }



}
