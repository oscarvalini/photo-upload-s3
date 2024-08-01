import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../auth.service';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MenubarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  menuItems: MenuItem[] = [
    {
      label: 'Photos',
      routerLink: ['/']
    },
    {
      label: 'Profile',
      routerLink: ['/profile']
    },
    {
      label: 'Sign Out',
      command: () => this.cognitoService.signOut().then(() => this.router.navigateByUrl('/signIn'))
    }
  ]

  constructor(private router: Router,
    private cognitoService: AuthService) {
  }

  public signOut(): void {
    this.cognitoService.signOut().then(() => {
      this.router.navigate(['/signIn']);
    });
  }

}
