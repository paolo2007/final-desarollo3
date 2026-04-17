import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsuarioService, Usuario } from '../services/usuario.service';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';
import { MatIconModule } from '@angular/material/icon'; 

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule   
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  dataSource = new MatTableDataSource<Usuario>();

  displayedColumns: string[] = [
    'dni','nombres','apellidos','telefono','vivienda',
    'carrera','ciclo','email','rol','acciones'
  ];

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe((data) => {
      console.log('Usuarios recibidos del backend:', data);

      this.usuarios = data.map((u: Usuario) => ({
        id: u.id,
        dni: u.dni,
        nombres: u.nombres,
        apellidos: u.apellidos,
        telefono: u.telefono,
        vivienda: u.vivienda,
        email: u.email,
        carrera: u.carrera,
        ciclo: u.ciclo,
        rol_id: u.rol_id,
        rol: u.rol || (u.rol_id === 1 ? 'admin' : u.rol_id === 2 ? 'profesor' : 'estudiante')
      }));

      this.dataSource = new MatTableDataSource(this.usuarios);
      this.cdRef.detectChanges();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  registrarUsuario(): void {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const rolMap: Record<string, number> = { admin: 1, profesor: 2, estudiante: 3 };
        const payload = { ...result, rol_id: rolMap[result.rol ?? 'estudiante'] };

        this.usuarioService.createUsuario(payload).subscribe({
          next: () => {
            alert('Usuario registrado correctamente');
            this.cargarUsuarios();
          },
          error: (err: any) => {
            console.error('Error al registrar usuario', err);
            alert('Error al registrar usuario: ' + (err.error?.detalle || err.message));
          }
        });
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '600px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const rolMap: Record<string, number> = { admin: 1, profesor: 2, estudiante: 3 };
        const payload = { ...result, rol_id: rolMap[result.rol ?? 'estudiante'] };

        this.usuarioService.updateUsuario(payload).subscribe({
          next: () => {
            alert('Usuario actualizado correctamente');
            this.cargarUsuarios();
          },
          error: (err: any) => console.error('Error al actualizar usuario', err)
        });
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe(() => {
        alert('Usuario eliminado correctamente');
        this.usuarios = this.usuarios.filter((u) => u.id !== id);
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.cdRef.detectChanges();
      });
    }
  }
}
