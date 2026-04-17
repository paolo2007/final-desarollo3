import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  profesor_id?: number;
  dni_profesor?: string; // usado solo en creación
  profesor?: {
    nombres: string;
    apellidos: string;
    dni: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CursoService {
  private apiUrl = 'http://localhost:3000/cursos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // donde guardas el JWT al hacer login
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso, { headers: this.getAuthHeaders() });
  }

  updateCurso(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/${id}`, curso, { headers: this.getAuthHeaders() });
  }

  deleteCurso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
