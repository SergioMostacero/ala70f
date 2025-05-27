import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Oficio } from '../../../../model/oficio.model';
import { OficioService } from '../../../../Services/oficio.service';
import { RouteEncoderService } from '../../../../Services/route-encoder.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../utils/notification.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent implements OnInit {
  oficios: Oficio[] = [];
  selectedOficio?: Oficio;
  @Output() saved = new EventEmitter<Oficio>();
  form!: FormGroup;
  loading = false;
  @ViewChild('editForm') private editFormRef?: ElementRef<HTMLFormElement>;

  constructor(
    private router: Router,
    private encoder: RouteEncoderService,
    private fb: FormBuilder,
    private oficioService: OficioService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadOficios();
  }

  goBack(): void {
    this.router.navigate([this.encoder.encode('management')]);
  }

  //cre el form con las validaciones
  private buildForm(oficio?: Oficio): void {
    this.form = this.fb.group({
      id: [oficio?.id || null],
      nombre: [oficio?.nombre ?? '', [Validators.required, Validators.maxLength(60)]],
      descripcion: [oficio?.descripcion ?? '', [Validators.required, Validators.maxLength(255)]]
    });
  }

  //carga los oficios
  private loadOficios(): void {
    this.oficioService.getOficios().subscribe({
      next: data => this.oficios = data,
      error: err => {
        console.error(err);
        this.notification.showMessage('Error al cargar los oficios.', 'error');
      }
    });
  }
  //selecciona el oficio a editar
  selectOficio(oficio: Oficio): void {
    this.selectedOficio = oficio;
    this.buildForm(oficio);

    setTimeout(() => {
      this.editFormRef?.nativeElement.scrollIntoView({
        behavior: 'smooth',   
        block: 'start'        
      });
  
    });
  }

  //guardar la edicion de oficios
  submit(): void {
    if (this.form.invalid || !this.form.value.id) {
      this.form.markAllAsTouched();
      this.notification.showMessage('Por favor, selecciona un oficio para editar.', 'error');
      return;
    }

    const data: Oficio = this.form.value;
    this.loading = true;

    this.oficioService.updateOficio(data).subscribe({
      next: resp => {
        this.saved.emit(resp);
        this.loadOficios();
        this.notification.showMessage('Oficio actualizado con éxito.', 'success');
        this.clearSelection();
      },
      error: err => {
        console.error(err);
        this.notification.showMessage('Error al actualizar el oficio.', 'error');
      },
      complete: () => (this.loading = false)
    });
  }

  //borrar un oficio
  deleteOficio(id: number): void {
    Swal.fire({
      title: '¿Eliminar oficio?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#d33',
      customClass: { popup: 'dark' }    
    }).then(res => {
      if (!res.isConfirmed) { return; }

      this.oficioService.deleteOficio(id).subscribe({
        next: () => {
          this.oficios = this.oficios.filter(o => o.id !== id);
          this.notification.showMessage('Oficio eliminado con éxito.', 'success');
          this.clearSelection?.();

          Swal.fire({
            title: '¡Borrado!',
            text: 'Oficio eliminado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: { popup: 'dark' }  
          });
        },
        error: err => {
          console.error(err);
          this.notification.showMessage('Error al eliminar el oficio.', 'error');

          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el oficio',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: { popup: 'dark' } 
          });
        }
      });
    });
  }

  //limpiar eltexto de abajo
  clearSelection(): void {
    this.selectedOficio = undefined;
    this.buildForm();
  }
}