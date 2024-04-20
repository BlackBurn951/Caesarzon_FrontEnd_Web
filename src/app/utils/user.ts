export interface user {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
}
  export class user {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;

  constructor(data: user) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
    this.email = data.email;
  }
}
