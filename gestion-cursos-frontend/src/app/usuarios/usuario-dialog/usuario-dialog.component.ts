import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent {
  usuario: Usuario;

  constructor(
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {
    // Si viene vacío (registro), inicializa con valores por defecto
    this.usuario = { ...data };
  }

  guardar(): void {
    if (this.data && this.data.id) {
      // edición
      if (confirm('¿Estás seguro de actualizar los datos de este usuario?')) {
        this.dialogRef.close(this.usuario);
      }
    } else {
      // registro
      if (confirm('¿Estás seguro de registrar este nuevo usuario?')) {
        this.dialogRef.close(this.usuario);
      }
    }
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
