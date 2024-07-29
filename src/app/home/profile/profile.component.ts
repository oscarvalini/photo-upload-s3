import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CognitoService, IUser } from '../../cognito.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  loading: boolean;
  user: IUser;

  constructor(private cognitoService: CognitoService) {
    this.loading = false;
    this.user = {} as IUser;
  }

  public ngOnInit(): void {
    this.cognitoService.getUser()
    .then((user) => {
      this.user = {email: user.username} as IUser; 
    });
  }

  // public update(): void {
  //   this.loading = true;

  //   this.cognitoService.updateUser(this.user)
  //   .then(() => {
  //     this.loading = false;
  //   }).catch(() => {
  //     this.loading = false;
  //   });
  // }
}
