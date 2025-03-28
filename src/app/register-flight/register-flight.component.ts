import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-flight.component.html',
  styleUrls: ['./register-flight.component.scss']
})
export class RegisterFlightComponent implements OnInit {

  // Campos del formulario
  flightDate!: string;
  merchandise!: string;
  selectedAirplane!: string;
  from!: string;
  fromTime!: string;
  to!: string;
  toTime!: string;
  horasMes!: number;
  horasAnio!: number;
  horasTotales!: number;
  anticipo!: string;
  liquido!: string;
  fuel!: string;
  hotel!: string;

  // Tripulación
  public crewMembers: { name: string; rank: string }[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // 1) Leer el usuario del localStorage
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);

      // 2) Prellenar tripulantes con el usuario logueado (opcional)
      this.crewMembers = [
        {
          name: `${user.nombre} ${user.apellido}`,
          // Podrías usar el campo "rango" del usuario si lo tienes:
          rank: user.rango ? user.rango.nombre : ''
        }
      ];

      // Si quieres prellenar más datos del formulario con info del usuario:
      // (ej. flightDate, from, etc.), ajusta aquí según tu lógica.
      // this.flightDate = ...
      // this.merchandise = ...
    }
  }

  addCrewMember() {
    this.crewMembers.push({ name: '', rank: '' });
  }

  removeCrewMember(index: number) {
    this.crewMembers.splice(index, 1);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  guardar() {
    // Aquí podrías mandar todo este objeto al backend:
    // flightDate, merchandise, selectedAirplane, from, to, etc.
    // junto con la tripulación (crewMembers), por ejemplo:
    const flightData = {
      flightDate: this.flightDate,
      merchandise: this.merchandise,
      selectedAirplane: this.selectedAirplane,
      from: this.from,
      fromTime: this.fromTime,
      to: this.to,
      toTime: this.toTime,
      horasMes: this.horasMes,
      horasAnio: this.horasAnio,
      horasTotales: this.horasTotales,
      anticipo: this.anticipo,
      liquido: this.liquido,
      fuel: this.fuel,
      hotel: this.hotel,
      crewMembers: this.crewMembers
    };

    console.log('Datos a enviar al backend:', flightData);
    // Harías la llamada HTTP (por ejemplo con this.http.post(...))
  }
}
