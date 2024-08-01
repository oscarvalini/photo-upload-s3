import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { confirmSignUp, ConfirmSignUpOutput, fetchAuthSession, getCurrentUser, signIn, signOut, signUp } from 'aws-amplify/auth';
import { BehaviorSubject } from 'rxjs';
import { Hub } from 'aws-amplify/utils';

import { environment } from '../environments/environment';
import { Router } from '@angular/router';

export interface IUser {
  email: string;
  password: string;
  code: string;
  name: string;
  username: string;
  birthdate: string;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  COGNITO_ID = `cognito-idp.${environment.s3Region}.amazonaws.com/sa-east-1_2Qkdl097h`;
  IDENTITY_POOL_ID = 'sa-east-1:859c0323-3c0e-427b-aee6-c9017ae20aba';

  private sessionSubject$ = new BehaviorSubject<{ idToken: string } | null>(null);
  session$ = this.sessionSubject$.asObservable();

  get session() {
    return this.sessionSubject$.value;
  }

  constructor(private router: Router) {
    Amplify.configure({
      Auth: { Cognito: { userPoolClientId: environment.cognito.userPoolWebClientId, userPoolId: environment.cognito.userPoolId } }
    });

    Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') {
        this.updateSession();
      }
      if (payload.event === 'tokenRefresh') {
        console.log('token refresh');
        this.updateSession();
      }
      if (payload.event === 'tokenRefresh_failure') {
        this.signOut();
      }
    })
  }

  public async signUp(user: IUser): Promise<any> {
    return signUp({
      username: user.username,
      options: { userAttributes: { email: user.email, birthdate: user.birthdate, name: user.name, gender: user.gender } },
      password: user.password,
    });
  }

  public async confirmSignUp(user: IUser): Promise<ConfirmSignUpOutput> {
    return confirmSignUp({ username: user.username, confirmationCode: user.code });
  }

  public async signIn(user: IUser): Promise<void> {
    return signIn({ username: user.email, password: user.password })
      .then(() => this.updateSession());
  }


  public async signOut() {
    return signOut()
      .then(() => {
        this.sessionSubject$.next(null);
      });
  }

  public async isAuthenticated(): Promise<boolean> {
    if (this.session) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
        .then((user) => {
          return true;
        }).catch((err) => {
          return false;
        });
    }
  }

  public async getUser() {
    return getCurrentUser();
  }

  // public updateUser(user: IUser): Promise<any> {
  //   return Auth.currentUserPoolUser()
  //   .then((cognitoUser: any) => {
  //     return Auth.updateUserAttributes(cognitoUser, user);
  //   });
  // }

  public async updateSession(forceRefresh = false) {
    return fetchAuthSession({ forceRefresh }).then((session) => {
      if (session.tokens?.idToken) {
        this.sessionSubject$.next({ idToken: session.tokens.idToken.toString() });
      } 
    })
  }
}
