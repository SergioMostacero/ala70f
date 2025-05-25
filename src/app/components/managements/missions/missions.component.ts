import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { MisionService } from 'src/app/Services/mision.service';
import { NotificationService } from 'src/app/utils/notification.service';
import { Router } from '@angular/router';
import { RouteEncoderService } from 'src/app/Services/route-encoder.service';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss']
})
export class MissionsComponent implements OnInit {
  @ViewChild('formSection') formSection!: ElementRef;

  misiones: any[] = [];
  missionForm!: FormGroup;
  isEdit   = false; 
  showForm = false;
  private currentId?: number;

  constructor(
    private fb: FormBuilder,
    private misionService: MisionService,
    private notification: NotificationService,
    private router: Router,
    private encoder: RouteEncoderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMisiones();
  }

  private initForm(): void {
    this.missionForm = this.fb.group({
      nombre: ['', Validators.required],
    });
  }

  private loadMisiones(): void {
    this.misionService.getAll().subscribe({
      next: list => this.misiones = list,
      error: () => this.notification.showMessage('Error al cargar misiones', 'error')
    });
  }

  newMission(): void {
    this.isEdit   = false;
    this.showForm = true;
    this.currentId = undefined;

    this.missionForm.reset();
    setTimeout(() => {
      if (this.formSection) {
        this.formSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  
  editMission(m: any): void {
    this.isEdit   = true;
    this.showForm = true;
    this.currentId = m.id;

    this.missionForm.patchValue({ nombre: m.nombre });
    setTimeout(() => {
      if (this.formSection) {
        this.formSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }


  onSubmit(): void {
    if (this.missionForm.invalid) {
      this.notification.showMessage('Completa el formulario correctamente.', 'error');
      return;
    }
    const dto = this.missionForm.value;

    if (this.isEdit && this.currentId != null) {
      this.misionService.update(this.currentId, dto).subscribe({
        next: () => {
          this.notification.showMessage('Misión actualizada.', 'success');
          this.afterSave();
        },
        error: () => this.notification.showMessage('Error al actualizar misión.', 'error')
      });
    } else {
      this.misionService.create(dto).subscribe({
        next: () => {
          this.notification.showMessage('Misión creada.', 'success');
          this.afterSave();
        },
        error: () => this.notification.showMessage('Error al crear misión.', 'error')
      });
    }
  }

deleteMission(id: number): void {
  Swal.fire({
    title: '¿Eliminar misión?',
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

    this.misionService.delete(id).subscribe({
      next: () => {
        this.misiones = this.misiones.filter(m => m.id !== id);

        Swal.fire({
          title: '¡Borrado!',
          text: 'Misión eliminada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'dark' }   
        });
      },
      error: err => {
        console.error(err);

        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la misión',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          customClass: { popup: 'dark' }   
        });
      }
    });
  });
}


  resetForm(): void {
    this.showForm = false;
    this.isEdit   = false;
    this.currentId = undefined;
    this.missionForm.reset();
  }

  private afterSave(): void {
    this.loadMisiones();
    this.resetForm();
  }

  goBack(): void {
    this.router.navigate([ this.encoder.encode('management') ]);
  }
}
