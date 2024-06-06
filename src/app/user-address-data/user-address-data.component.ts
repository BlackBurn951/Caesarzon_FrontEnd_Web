import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { UserManagementContainerComponent } from "../user-management-container/user-management-container.component";
import { PopupService } from "../services/popUpService";
import {Address} from "../entities/Address";
import {AddressService} from "../services/addressService";
import {NgForOf} from "@angular/common";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-address-data',
  standalone: true,
  imports: [
    FooterComponent,
    UserManagementContainerComponent,
    NgForOf,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    ReactiveFormsModule
  ],
  templateUrl: './user-address-data.component.html',
  styleUrls: ['./user-address-data.component.css', '../../styles.css']
})
export class UserAddressDataComponent implements OnInit {


  indirizzoCorrente!: Address | undefined;
  addresses: Address[] = [];

  constructor(
    public popUpService: PopupService,
    private addressService: AddressService,
  ) { }

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressService.getAddresses().subscribe(
      (data: Address[]) => {
        this.addresses = data;
        if (this.addresses.length > 0) {
          this.indirizzoCorrente = this.addresses[0];
        }
      },
      (error: any) => {
        console.error('Errore nel caricamento degli indirizzi', error);
      }
    );
  }

  onAddressChange(event: Event): void {
    const selectedAddress = (event.target as HTMLSelectElement).value;
    this.indirizzoCorrente = this.addresses.find(address => address.roadName === selectedAddress);
  }



}
