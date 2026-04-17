import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showRegister = false;

  // 👇 Aquí inyectas AuthService y Router
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
  dni: ['', Validators.required],
  nombres: ['', Validators.required],
  apellidos: ['', Validators.required],
  telefono: ['', Validators.required],
  vivienda: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required],
  rol_id: [3, Validators.required], // por defecto estudiante
  carrera: ['', Validators.required],
  ciclo: ['', Validators.required]
});

  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => alert('Credenciales inválidas')
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Usuario registrado correctamente ');
          this.showRegister = false; // vuelve al login
        },
        error: () => alert('Error al registrar usuario')
      });
    }
  }
}
