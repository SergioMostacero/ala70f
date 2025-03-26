import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../Services/usuario.service';
import { Usuario } from '../model/usuario.model';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  login() {
    this.usuarioService.loginUsuario(this.email, this.password).subscribe({
      next: (user: Usuario) => {
        console.log('Usuario logueado:', user);
        this.usuarioService.setLoggedInUser(user);

        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        alert('Credenciales incorrectas o usuario no encontrado');
      }
    });
  }
}
