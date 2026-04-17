import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsuarioService, Usuario } from '../services/usuario.service';
import { CursoService, Curso } from '../services/curso.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  totalUsuarios = 0;
  totalCursos = 0;
  cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.totalUsuarios = usuarios.length;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.cargando = false;
      }
    });

    this.cursoService.getCursos().subscribe({
      next: (cursos: Curso[]) => {
        this.totalCursos = cursos.length;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
      }
    });
  }

  irGestionUsuarios(): void {
    this.router.navigate(['/usuarios']);
  }

  irGestionCursos(): void {
    this.router.navigate(['/cursos']);
  }
}
