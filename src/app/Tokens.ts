export class Tokens {
  access: string;
  refresh : string;
  _csrf: string;


  constructor(data: any) {
    this.access = data.access;
    this.refresh= data.refresh;
    this._csrf= data._csrf;

  }
}
