import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { MenubarModule } from 'primeng/menubar'
import { MenuItem } from 'primeng/api';
import { filter, skip } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink, MenubarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private readonly router: Router, private readonly cognitoService: AuthService, private readonly route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.cognitoService.isAuthenticated().then((success: boolean) => {
        if (success) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['/signIn'])
        }
      });
      this.cognitoService.session$.pipe(filter(val => val === null)).pipe(skip(1)).subscribe(() => console.log('DESLOGAR'))
  }

}
