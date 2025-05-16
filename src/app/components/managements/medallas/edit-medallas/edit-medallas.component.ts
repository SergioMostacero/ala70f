import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { MedallaService } from 'src/app/Services/medalla.service';
import { NotificationService } from 'src/app/utils/notification.service';

@Component({
  selector: 'app-edit-medallas',
  templateUrl: './edit-medallas.component.html',
  styleUrls: ['./edit-medallas.component.scss']
})
export class EditMedallasComponent implements OnInit {
  @ViewChild('formSection') formSection!: ElementRef;

  medallas: any[] = [];
  medallaForm!: FormGroup;
  isEdit = false;
  private currentId?: number;

  constructor(
    private fb: FormBuilder,
    private medallaService: MedallaService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMedallas();
  }

  private initForm(): void {
    this.medallaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  private loadMedallas(): void {
    this.medallaService.getAllMedallas().subscribe({
      next: list => this.medallas = list,
      error: () => this.notification.showMessage('Error al cargar medallas', 'error')
    });
  }

  /** Prepara formulario para editar */
  editMedalla(m: any): void {
    this.isEdit = true;
    this.currentId = m.id;
    this.medallaForm.patchValue({
      nombre: m.nombre,
      descripcion: m.descripcion
    });
    // Scroll suave al formulario
    setTimeout(() => {
      this.formSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /** Crear o actualizar medalla */
  onSubmit(): void {
    if (this.medallaForm.invalid) {
      this.notification.showMessage('Completa el formulario correctamente.', 'error');
      return;
    }
    const dto = this.medallaForm.value;

    if (this.isEdit && this.currentId != null) {
      // ACTUALIZAR
      this.medallaService.updateMedalla(this.currentId, dto).subscribe({
        next: () => {
          this.notification.showMessage('Medalla actualizada.', 'success');
          this.afterSave();
        },
        error: () => this.notification.showMessage('Error al actualizar medalla.', 'error')
      });
    } else {
      // CREAR
      this.medallaService.createMedalla(dto).subscribe({
        next: () => {
          this.notification.showMessage('Medalla creada.', 'success');
          this.afterSave();
        },
        error: () => this.notification.showMessage('Error al crear medalla.', 'error')
      });
    }
  }

  /** Borrar con confirmación */
  deleteMedalla(id: number): void {
    Swal.fire({
      title: '¿Eliminar medalla?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#d33',
      customClass: { popup: 'dark' }
    }).then(res => {
      if (!res.isConfirmed) return;
      this.medallaService.deleteMedalla(id).subscribe({
        next: () => {
          this.medallas = this.medallas.filter(x => x.id !== id);
          Swal.fire('¡Borrado!', 'Medalla eliminada correctamente.', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo eliminar medalla', 'error')
      });
    });
  }

  /** Cancelar edición / reset al modo crear */
  resetForm(): void {
    this.isEdit = false;
    this.currentId = undefined;
    this.medallaForm.reset();
  }

  private afterSave(): void {
    this.loadMedallas();
    this.resetForm();
  }
}
