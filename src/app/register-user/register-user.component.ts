import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../Services/tripulantes.service';
import { RangoService } from '../Services/rango.service';
import { GrupoSanguineoService } from '../Services/grupo-sanguineo.service';
import { OficioService } from '../Services/oficio.service';
import { Tripulantes } from '../model/tripulantes.model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  // Campos básicos
  nombre: string = '';
  apellidos: string = '';
  antiguedad: string = '';
  horasVuelo: number = 0;
  email: string = '';
  contrasena: string = '';
  
  // Relaciones con IDs
  grupoSanguineoId: number = 0;
  rangoId: number = 0;
  oficioId: number = 0;

  // Listas para selects
  rangos: any[] = [];
  gruposSanguineos: any[] = [];
  oficios: any[] = [];

  constructor(
    private tripulantesService: TripulantesService,
    private rangoService: RangoService,
    private grupoSanguineoService: GrupoSanguineoService,
    private oficioService: OficioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarOpciones();
  }

  cargarOpciones() {
    this.rangoService.getRangos().subscribe(data => this.rangos = data);
    this.grupoSanguineoService.getGruposSanguineos().subscribe(data => this.gruposSanguineos = data);
    this.oficioService.getOficios().subscribe(data => this.oficios = data);
  }

  registrar() {
    // Busca los objetos completos usando los IDs seleccionados
    const grupoSanguineo = this.gruposSanguineos.find(g => g.id === this.grupoSanguineoId);
    const rango = this.rangos.find(r => r.id === this.rangoId);
    const oficio = this.oficios.find(o => o.id === this.oficioId);
  
    const nuevoTripulante: Tripulantes = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      contrasena: this.contrasena,
      antiguedad: this.antiguedad,
      horas_totales: this.horasVuelo.toString(),
      grupoSanguineo: grupoSanguineo!, // Asume que siempre se selecciona un valor válido
      rango: rango!,
      oficio: oficio!,
      horas_mes: '0',
      horas_año: '0',
      medallas: [],
      vuelos: []
    };
  
    this.tripulantesService.createTripulantes(nuevoTripulante).subscribe({
      next: (res) => {
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