export class Tokens {
  access: string;
  refresh : string;


  constructor(data: any) {
    this.access = data.access;
    this.refresh= data.refresh;

  }
}
