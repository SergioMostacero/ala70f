import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../Services/tripulantes.service';
import { Tripulantes } from '../model/Tripulantes.model';
import { Rango } from '../model/rango.model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent {
  // Campos para crear el tripulantes
  nombre: string = '';
  apellidos: string = '';
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
    private tripulantesService: TripulantesService,
    private router: Router
  ) {}

  registrar() {
    // Busca en el array el rango que coincida con el ID elegido
    const rangoSeleccionado = this.rangos.find(r => r.id === this.rangoSeleccionadoId);

    // Crear objeto con datos del nuevo tripulantes
    const newUser: Tripulantes = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      grupo_sanguineo: this.grupoSanguineo,
      antiguedad: this.antiguedad,
      horas_vuelo: this.horasVuelo,
      email: this.email,
      contrasena: this.contrasena,
      // Asignamos el rango que se haya seleccionado
      rango: rangoSeleccionado!,
    };

    // POST al backend para crear el tripulantes
    this.tripulantesService.createTripulantes(newUser).subscribe({
      next: (createdUser) => {
        console.log('Tripulantes registrado:', createdUser);
        alert('Registro exitoso');
        // Redirige al login o donde gustes
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al registrar tripulantes:', error);
        alert('No se pudo registrar el tripulantes');
      }
    });
  }
}
