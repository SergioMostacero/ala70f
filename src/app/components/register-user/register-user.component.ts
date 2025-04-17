import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RangoService } from '../../Services/rango.service';
import { GrupoSanguineoService } from '../../Services/grupo-sanguineo.service';
import { OficioService } from '../../Services/oficio.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { Rango } from '../../model/rango.model';
import { GrupoSanguineo } from '../../model/grupo-sanguineo.model';
import { Oficio } from '../../model/oficio.model';
import { TripulantesService } from '../../Services/tripulantes.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  currentTripulante!: Tripulantes;
  // Campos básicos
  nombre: string = '';
  apellidos: string = '';
  antiguedad: Date | undefined ;
  horasVuelo: number = 0;
  permisos: boolean = false;
  email: string = '';
  contrasena: string = '';

  // Relación con objetos seleccionados
  grupoSanguineoSeleccionado!: GrupoSanguineo;
  rangoSeleccionado!: Rango;
  oficioSeleccionado!: Oficio;

  // Listas para selects
  rangos: Rango[] = [];
  gruposSanguineos: GrupoSanguineo[] = [];
  oficios: Oficio[] = [];

  constructor(
    private tripulantesService: TripulantesService,
    private rangoService: RangoService,
    private grupoSanguineoService: GrupoSanguineoService,
    private oficioService: OficioService,
    private router: Router
  ) {}

  compareById(a: any, b: any): boolean {
    return a?.id === b?.id;
  }
  
  
  ngOnInit() {
    this.cargarOpciones();
    
  }

  cargarOpciones() {
    this.rangoService.getRangos().subscribe(data => {
      this.rangos = data;
    });
  
    this.grupoSanguineoService.getGruposSanguineos().subscribe(data => {
      this.gruposSanguineos = data;
    });
  
    this.oficioService.getOficios().subscribe(data => {
      this.oficios = data;
    });
  }
  

  

  registrar() {
    // Validación de campos obligatorios
    if (
      !this.nombre.trim() ||
      !this.apellidos.trim() ||
      !this.antiguedad ||
      !this.horasVuelo ||
      !this.email.trim() ||
      !this.contrasena.trim()
    ) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (
      !this.grupoSanguineoSeleccionado ||
      !this.rangoSeleccionado ||
      !this.oficioSeleccionado
    ) {
      alert('Por favor selecciona grupo sanguíneo, rango y oficio.');
      return;
    }

    const nuevoTripulante: Tripulantes = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      contrasena: this.contrasena,
      antiguedad: this.antiguedad,
      horas_totales: this.horasVuelo.toString(),
      permisos: false,
      grupoSanguineo: this.grupoSanguineoSeleccionado,
      rango: this.rangoSeleccionado,
      oficio: this.oficioSeleccionado,
      medallas: [],
      vuelos: []
    };

    this.tripulantesService.createTripulantes(nuevoTripulante).subscribe({
      next: () => {
        alert('Registro exitoso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al registrar: ' + err.error.message);
      }
    });
  }
}
