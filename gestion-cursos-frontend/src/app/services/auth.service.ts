import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    tap((response: any) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
    })
  );
}


  // REGISTRO
  register(data: { nombre: string; email: string; password: string; rol_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/register`, data);
  }

  // TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // OBTENER ROL DEL USUARIO DESDE EL TOKEN
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload JWT:', payload); // imprime para verificar

      switch (payload.rol_id) { //usa rol_id porque así viene del backend
        case 1: return 'admin';
        case 2: return 'profesor';
        case 3: return 'estudiante';
        default: return null;
      }
    } catch {
      return null;
    }
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
