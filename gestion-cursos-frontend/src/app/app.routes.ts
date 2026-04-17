import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard';
import { PageNotFoundComponent } from './page-not-found/page-not-found';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.routes').then(m => m.usuariosRoutes),
        canActivate: [RoleGuard],
        data: { restrictedRoles: ['estudiante'] }
      },
      { 
        path: 'cursos',
        loadChildren: () => import('./cursos/cursos.routes').then(m => m.cursosRoutes),
        canActivate: [RoleGuard],
        data: { restrictedRoles: ['estudiante'] }
      },
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];
