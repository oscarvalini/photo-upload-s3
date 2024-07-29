import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CognitoService } from './cognito.service';
import { MenubarModule } from 'primeng/menubar'
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink, MenubarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private readonly router: Router, private readonly cognitoService: CognitoService, private readonly route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.cognitoService.isAuthenticated().then((success: boolean) => {
        if (success) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['/signIn'])
        }
      });
  }
}
