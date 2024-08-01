import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthService } from "./auth.service";

export const isAuth: CanActivateFn = async () => {
    const authService = inject(AuthService);

    return authService.isAuthenticated().then(isAuth => {
        if(isAuth && authService.session === null) {
            console.log('Obtém novo token de sessão');
            return authService.updateSession().then(() => true);
        }

        return isAuth;
    })
}