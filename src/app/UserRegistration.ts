export class UserRegistration {
  email: string;
  firstName : string;
  lastName : string;
  enabled : string;
  username : string;


  constructor(data: any) {
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.enabled = data.enabled;
    this.username = data.username;


  }
}
