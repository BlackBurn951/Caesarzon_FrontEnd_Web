export interface address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export class address {
  street: string;
  city: string;
  state: string;
  postalCode: string;

  constructor(data: address) {
    this.street = data.street;
    this.city = data.city;
    this.state = data.state;
    this.postalCode = data.postalCode;
  }
}
