import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Address} from "../entities/Address";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = 'https://localhost:8090/user-api/address';

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }
}
