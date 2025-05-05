// src/app/components/managements/create-job/create-job.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OficioService } from '../../../Services/oficio.service';
import { NotificationService } from '../../../utils/notification.service';
import { Oficio } from '../../../model/oficio.model';
import { RouteEncoderService } from '../../../Services/route-encoder.service';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss']
})
export class CreateJobComponent {

  jobForm: FormGroup;

  constructor(
    private encoder: RouteEncoderService,
    private fb: FormBuilder,
    private oficioService: OficioService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      nombre:       ['', [Validators.required, Validators.minLength(3)]],
      descripcion:  ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.notification.showMessage('Completa todos los campos obligatorios', 'error');
      return;
    }

    const payload: Oficio = this.jobForm.value;   // {nombre, descripcion}

    this.oficioService.createOficio(payload).subscribe({
      next: () => {
        this.notification.showMessage('Oficio creado con éxito', 'success');
        this.router.navigate([this.encoder.encode('management')]);
      },
      error: () =>
        this.notification.showMessage('Error creando oficio', 'error')
    });
  }

  goBack(): void {
    const encoder = new RouteEncoderService();
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    
    const ruta = tienePermisos 
      ? encoder.encode('management') 
      : encoder.encode('home');
  
    this.router.navigate([ruta]);
  }
}
