import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { CursoService, Curso } from '../services/curso.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {
  cursos: Curso[] = [];
  dataSource = new MatTableDataSource<Curso>();
  displayedColumns: string[] = ['nombre', 'descripcion', 'activo'];

  @ViewChild(MatTable) table!: MatTable<Curso>;

  nuevoCurso: Partial<Curso> = { nombre: '', descripcion: '', activo: true, dni_profesor: '' };

  // Estado para edición
  cursoEditando: Curso | null = null;
  cursoEditado: Partial<Curso> = {};

  constructor(private cursoService: CursoService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.cursoService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.dataSource.data = this.cursos;
        this.cd.detectChanges();   // fuerza actualización de la vista
        this.table.renderRows();   // refresca la tabla
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
      }
    });
  }

  agregarCurso(): void {
    this.cursoService.createCurso(this.nuevoCurso as Curso).subscribe({
      next: () => {
        alert('Curso agregado correctamente');
        this.cargarCursos();
        this.nuevoCurso = { nombre: '', descripcion: '', activo: true, dni_profesor: '' };
      },
      error: (err) => {
        console.error('Error al agregar curso:', err);
        alert('No se pudo agregar el curso. Revisa la consola.');
      }
    });
  }

  abrirEdicion(curso: Curso): void {
    this.cursoEditando = curso;
    this.cursoEditado = { ...curso, dni_profesor: curso.profesor?.dni };
  }

  guardarEdicion(): void {
    if (this.cursoEditando) {
      this.cursoService.updateCurso(this.cursoEditando.id, this.cursoEditado as Curso).subscribe({
        next: () => {
          alert('Curso actualizado correctamente');
          this.cargarCursos();
          this.cursoEditando = null;
          this.cursoEditado = {};
        },
        error: (err) => {
          console.error('Error al actualizar curso:', err);
          alert('No se pudo actualizar el curso');
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.cursoEditando = null;
    this.cursoEditado = {};
  }

  eliminarCurso(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este curso?')) {
      this.cursoService.deleteCurso(id).subscribe({
        next: () => {
          alert('Curso eliminado correctamente');
          this.cargarCursos();
        },
        error: (err) => {
          console.error('Error al eliminar curso:', err);
          alert('No se pudo eliminar el curso');
        }
      });
    }
  }
}
