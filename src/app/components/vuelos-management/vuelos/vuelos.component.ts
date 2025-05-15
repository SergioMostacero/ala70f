import { Component, OnInit } from '@angular/core';
import { VueloService } from '../../../Services/vuelo.service';
import { Router } from '@angular/router';
import { RouteEncoderService } from '../../../Services/route-encoder.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.scss']
})
export class VuelosComponent implements OnInit {
  vuelosRecientes: any[] = [];
  mostrarBotonRegistro = false;
  mostrarBotonEdicion = false;

  constructor(
    private encoder: RouteEncoderService,
    private vueloService: VueloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVuelosUsuario();
    const permisos = localStorage.getItem('permisos') === 'true';
    this.mostrarBotonRegistro = permisos;
    this.mostrarBotonEdicion  = permisos;  
  }

  goBack(): void {
  this.router.navigate([ this.encoder.encode('homePermisos') ]);
}

  irARegistrarVuelo() {
    this.router.navigate([this.encoder.encode('register-flights')]);
  }

  verVuelo(vueloId: number) {
    const encodedPath = this.encoder.encode('vuelo');
    this.router.navigate([encodedPath, vueloId]); // Mantener ID legible
  }
  editarVuelo(vueloId: number){
    const path = this.encoder.encode('editar-vuelo');
    this.router.navigate([path, vueloId]);
  }
  borrarVuelo(vueloId: number): void {

  Swal.fire({
    title: '¿Eliminar vuelo?',
    text : 'Esta acción no se puede deshacer',
    icon : 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, borrar',
    cancelButtonText : 'Cancelar',
    reverseButtons   : true,
    confirmButtonColor: '#d33',
    customClass: { popup: 'dark' }
  }).then(result => {

    if (!result.isConfirmed) { return; }

    this.vueloService.deleteVuelo(vueloId).subscribe({
      next: () => {
        this.vuelosRecientes =
          this.vuelosRecientes.filter(v => v.id !== vueloId);

        Swal.fire(
          '¡Borrado!',
          'El vuelo se eliminó correctamente.',
          'success'
        );
      },
      error: () =>
        Swal.fire(
          'Error',
          'No se pudo eliminar el vuelo',
          'error'
        )
    });
  });
}


  private loadVuelosUsuario(): void {
    const tripulanteId = Number(localStorage.getItem('tripulanteId'));
    if (tripulanteId) {
      this.vueloService.getVuelosByUser(tripulanteId).subscribe({
        next: (data) => {
          const hoy = new Date();
          this.vuelosRecientes = data.filter((vuelo: any) => {
            // Convertimos fecha_salida a Date (asegúrate de que sea YYYY-MM-DD)
            if (vuelo.fecha_salida) {
              const fechaVuelo = new Date(vuelo.fecha_salida);
              return fechaVuelo >= hoy;
            }
            return false;
          });
        },
        error: (err) => console.error('Error cargando vuelos recientes:', err)
      });
    } else {
      console.warn('No se encontró el tripulanteId en localStorage');
    }
  }
  
  
}
