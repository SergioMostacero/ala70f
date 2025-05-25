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
    this.loadVuelos(permisos);
  }

  private loadVuelos(permisos: boolean): void {
    // Si no hay usuario logueado y no tiene permisos, no hacer nada
    const raw = localStorage.getItem('usuarioLogeado');
    if (!raw && !permisos) {
      console.warn('No hay usuario logueado');
      return;
    }

    let obs$;
    if (permisos) {
      // carga **todos** los vuelos
      obs$ = this.vueloService.getAllVuelos();
    } else {
      // carga sólo los vuelos del usuario
      const usuario = JSON.parse(raw!) as { id: number };
      obs$ = this.vueloService.getVuelosByUser(usuario.id);
    }

    obs$.subscribe({
      next: (data) => {
        // filtramos sólo los futuros o de hoy
        const hoy = new Date();
        this.vuelosRecientes = data.filter(v =>
          v.fecha_salida && new Date(v.fecha_salida) >= hoy
        );
      },
      error: (err) => console.error('Error cargando vuelos:', err)
    });
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


// En vuelos.component.ts
private loadVuelosUsuario(): void {
  const raw = localStorage.getItem('usuarioLogeado');
  if (!raw) {
    console.warn('No hay usuario logueado');
    return;
  }

  const usuario = JSON.parse(raw) as { id: number };
  const tripulanteId = usuario.id;

  this.vueloService.getVuelosByUser(tripulanteId).subscribe({
    next: (data) => {
      this.vuelosRecientes = data.filter(
        v => v.fecha_salida && new Date(v.fecha_salida) >= new Date()
      );
    },
    error: (err) => console.error('Error cargando vuelos:', err)
  });
}



}
