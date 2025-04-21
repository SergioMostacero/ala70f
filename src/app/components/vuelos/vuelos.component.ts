import { Component, OnInit } from '@angular/core';
import { VueloService } from '../../Services/vuelo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.scss']
})
export class VuelosComponent implements OnInit {
  vuelosRecientes: any[] = [];
  mostrarBotonRegistro = false;

  constructor(
    private vueloService: VueloService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.loadVuelosUsuario();
    this.mostrarBotonRegistro = localStorage.getItem('permisos') === 'true';
  }

  // vuelos.component.ts (actualización del método goBack)
goBack() {
  this.router.navigate(['/homePermisos']);
}

  irARegistrarVuelo() {
    this.router.navigate(['/register-flights']);
  }

  private loadVuelosUsuario(): void {
    const tripulanteId = Number(localStorage.getItem('tripulanteId'));
    if (tripulanteId) {
      this.vueloService.getVuelosByUser(tripulanteId).subscribe({
        next: (data) => this.vuelosRecientes = data,
        error: (err) => console.error('Error cargando vuelos recientes:', err)
      });
    } else {
      console.warn('No se encontró el tripulanteId en localStorage');
    }
  }
}
