import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AppComponent } from './app.component';
import { isAuth } from './auth.guard';


export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'signUp',
        component: SignUpComponent,
      },
      {
        path: 'signIn',
        component: SignInComponent,
      },
      {
        path: '',
        canActivate: [isAuth],
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
        children: [
          { path: '', pathMatch: 'full', loadComponent: () => import('./home/photos/photos.component').then(c => c.PhotosComponent)},
          { path: 'profile', loadComponent: () => import('./home/profile/profile.component').then(c => c.ProfileComponent) }
        ]
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]
  }

];
