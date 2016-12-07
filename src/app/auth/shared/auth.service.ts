import { Injectable } from '@angular/core';
import { UserCredentials } from './../model/userCredentials';
import { environment } from './../../../environments/environment';

@Injectable()
export class AuthService {

  private host: string;
  private user: string;
  private password: string;

  constructor() {
    this.host = environment.host;
    this.user = environment.user;
    this.password = environment.password;
  }

  login() {
    console.log('Trying to login with: ', this.host, ', ', this.user);
  }
}
