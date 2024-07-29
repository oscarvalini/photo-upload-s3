import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { confirmSignUp, getCurrentUser, signIn, signOut, signUp } from 'aws-amplify/auth';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../environments/environment';

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
  username: string;
  birthdate: string;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  COGNITO_ID = `cognito-idp.${environment.s3Region}.amazonaws.com/sa-east-1_2Qkdl097h`;
  IDENTITY_POOL_ID = 'sa-east-1:859c0323-3c0e-427b-aee6-c9017ae20aba';

  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: {Cognito: {userPoolClientId: environment.cognito.userPoolWebClientId, userPoolId: environment.cognito.userPoolId}}
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(user: IUser): Promise<any> {
    return signUp({
      username: user.username,
      options:{userAttributes: {email: user.email, birthdate: user.birthdate, name: user.name, gender: user.gender}},
      password: user.password,
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return confirmSignUp({username: user.username, confirmationCode: user.code});
  }

  public signIn(user: IUser): Promise<any> {
    return signIn({username: user.email, password: user.password})
    .then(() => {
      this.authenticationSubject.next(true);
    });
  }

  public signOut() {
    return signOut()
    .then(() => {
      this.authenticationSubject.next(false);
    });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }).catch((err) => {
        return false;
      });
    }
  }

  public getUser() {
    return getCurrentUser();
  }

  // public updateUser(user: IUser): Promise<any> {
  //   return Auth.currentUserPoolUser()
  //   .then((cognitoUser: any) => {
  //     return Auth.updateUserAttributes(cognitoUser, user);
  //   });
  // }

}
