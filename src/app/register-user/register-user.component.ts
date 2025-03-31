import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../Services/usuario.service';
import { Usuario } from '../model/usuario.model';
import { Rango } from '../model/rango.model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent {
  // Campos para crear el usuario
  nombre: string = '';
  apellido1: string = '';
  apellido2: string = '';
  grupoSanguineo: string = '';
  antiguedad: string = '';
  horasVuelo: number = 0;
  email: string = '';
  contrasena: string = '';

  // Listado de rangos disponibles (puedes cargarlo de tu API si lo deseas)
  rangos: Rango[] = [
    { id: 1, nombre: 'Sargento', descripcion: 'Rango intermedio', medallaURL: null },
    { id: 2, nombre: 'Teniente', descripcion: 'Rango medio-alto', medallaURL: null},
    { id: 3, nombre: 'Capitán', descripcion: 'Rango alto', medallaURL: null}
  ];

  // Almacenar aquí el id del rango seleccionado
  rangoSeleccionadoId: number = 1;  // valor por defecto

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  registrar() {
    // Busca en el array el rango que coincida con el ID elegido
    const rangoSeleccionado = this.rangos.find(r => r.id === this.rangoSeleccionadoId);

    // Crear objeto con datos del nuevo usuario
    const newUser: Usuario = {
      nombre: this.nombre,
      apellido1: this.apellido1,
      apellido2: this.apellido2,
      grupo_sanguineo: this.grupoSanguineo,
      antiguedad: this.antiguedad,
      horas_vuelo: this.horasVuelo,
      email: this.email,
      contrasena: this.contrasena,
      // Asignamos el rango que se haya seleccionado
      rango: rangoSeleccionado!,
    };

    // POST al backend para crear el usuario
    this.usuarioService.createUsuario(newUser).subscribe({
      next: (createdUser) => {
        console.log('Usuario registrado:', createdUser);
        alert('Registro exitoso');
        // Redirige al login o donde gustes
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        alert('No se pudo registrar el usuario');
      }
    });
  }
}
