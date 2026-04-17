import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  vivienda: string;
  email: string;
  password?: string;
  rol_id: number;
  rol?: string;
  carrera: string;
  ciclo: number;
  editMode?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuario';
  private authUrl = 'http://localhost:3000/login/me';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todos los usuarios (solo admin/profesor)
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Crear usuario
  createUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario, { headers: this.getAuthHeaders() });
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Actualizar usuario
  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario, { headers: this.getAuthHeaders() });
  }

  // Buscar usuario por DNI
  getUsuarioPorDni(dni: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/dni/${dni}`, { headers: this.getAuthHeaders() });
  }

  // Obtener usuario autenticado
  getUsuarioActual(): Observable<Usuario> {
    return this.http.get<Usuario>(this.authUrl, { headers: this.getAuthHeaders() });
  }
}
