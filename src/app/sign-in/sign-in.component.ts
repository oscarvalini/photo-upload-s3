import { Component } from '@angular/core';
import { IUser, CognitoService } from '../cognito.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [NgClass, FormsModule, NgIf, ButtonModule, InputTextModule, CardModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  loading: boolean;
  user: IUser;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService.signIn(this.user)
    .then(() => {
      this.router.navigate(['/home/profile']);
    }).catch(() => {
      this.loading = false;
    });
  }
}
