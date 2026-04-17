import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const userRole: string | null = this.authService.getUserRole(); // 'admin', 'profesor', 'estudiante'
      const restrictedRoles: string[] = route.data['restrictedRoles'] as string[] || [];

      if (userRole && restrictedRoles.includes(userRole)) {
        this.router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    } catch (err: any) {
      console.error('Error en RoleGuard:', err);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
