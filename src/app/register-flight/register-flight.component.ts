import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from '../Services/flight.service';

@Component({
  selector: 'app-register-flight',
  // No "standalone: true" here
  templateUrl: './register-flight.component.html',
  styleUrls: ['./register-flight.component.scss']
})
export class RegisterFlightComponent implements OnInit {
  // Form fields
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

  constructor(
    private router: Router,
    private flightService: FlightService  // inject your service
  ) {}

  ngOnInit(): void {
    // Leer el usuario del localStorage
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.crewMembers = [
        {
          name: `${user.nombre} ${user.apellido}`,
          rank: user.rango ? user.rango.nombre : ''
        }
      ];
    }
  }

  addCrewMember() {
    this.crewMembers.push({ name: '', rank: '' });
  }

  removeCrewMember(index: number) {
    this.crewMembers.splice(index, 1);
  }

  /**
   * If you'd like to handle multiple flight segments, 
   * put your logic for adding new segment fields here.
   */
  addSegment() {
    console.log('Add segment clicked! You could add logic for multiple flight segments here.');
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  guardar() {
    // Build your flightData object
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

    // Call your backend via FlightService
    this.flightService.createFlight(flightData).subscribe({
      next: (response: any) => {
        console.log('Vuelo creado con éxito:', response);
        // Optionally navigate somewhere or show a success message
        // this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Error al crear el vuelo:', error);
      }
    });
  }
}
