import { Component } from '@angular/core';
import { IUser, AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [NgClass, FormsModule, NgIf, ButtonModule, InputTextModule, CardModule, RouterLink, ToastModule, IconFieldModule,
    InputIconModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [MessageService]
})
export class SignInComponent {
  loading: boolean;
  user: IUser;
  showPassword = false;

  constructor(private router: Router,
              private cognitoService: AuthService, private messageService: MessageService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public signIn(): void {
    this.loading = true;
    this.cognitoService.signIn(this.user)
    .then(() => {
      this.router.navigate(['/home/profile'])
    }).catch((err) => {
      console.error(err)
      this.messageService.add({severity: 'warn', summary: 'Authentication Error', detail: err.message})
      this.loading = false;
    });
  }
}
