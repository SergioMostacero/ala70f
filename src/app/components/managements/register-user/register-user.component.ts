import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { RangoService } from '../../../Services/rango.service';
import { GrupoSanguineoService } from '../../../Services/grupo-sanguineo.service';
import { OficioService } from '../../../Services/oficio.service';
import { TripulantesService } from '../../../Services/tripulantes.service';
import { NotificationService } from '../../../utils/notification.service';

import { Tripulantes } from '../../../model/Tripulantes.model';
import { Rango } from '../../../model/rango.model';
import { GrupoSanguineo } from '../../../model/grupo-sanguineo.model';
import { Oficio } from '../../../model/oficio.model';
import { RouteEncoderService } from '../../../Services/route-encoder.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  currentTripulante!: Tripulantes;
  nombre: string = '';
  apellidos: string = '';
  antiguedad: Date | undefined;
  horasVuelo: number = 0;
  permisos: boolean = false;
  email: string = '';
  contrasena: string = '';

  grupoSanguineoSeleccionado!: GrupoSanguineo;
  rangoSeleccionado!: Rango;
  oficioSeleccionado!: Oficio;

  rangos: Rango[] = [];
  gruposSanguineos: GrupoSanguineo[] = [];
  oficios: Oficio[] = [];

  constructor(
    private encoder: RouteEncoderService,
    private tripulantesService: TripulantesService,
    private rangoService: RangoService,
    private grupoSanguineoService: GrupoSanguineoService,
    private oficioService: OficioService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarOpciones();
  }

  compareById(a: any, b: any): boolean {
    return a?.id === b?.id;
  }

  goBack(): void {
    const encoder = new RouteEncoderService();
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    
    const ruta = tienePermisos 
      ? encoder.encode('management') 
      : encoder.encode('home');
  
    this.router.navigate([ruta]);
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
      antiguedad: this.antiguedad
        ? formatDate(this.antiguedad, 'yyyy-MM-dd', 'en-GB')
        : '',
      permisos: this.permisos,
      horas_totales: this.horasVuelo,
      grupoSanguineoDTO: { id: this.grupoSanguineoSeleccionado.id } as any,
      rangoDTO: { id: this.rangoSeleccionado.id } as any,
      oficioDTO: { id: this.oficioSeleccionado.id } as any
    };

    this.tripulantesService.createTripulantes(nuevoTripulante).subscribe({
      next: () => {
        alert('Registro exitoso!');
        this.router.navigate([this.encoder.encode('homePermisos')]);
      },
      error: (err) => {
        this.notification.showMessage(
          err?.error?.message || 'Error al registrar usuario',
          'error'
        );
      }
    });
  }
}
