import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { RangoService } from '../../../Services/rango.service';
import { GrupoSanguineoService } from '../../../Services/grupo-sanguineo.service';
import { OficioService } from '../../../Services/oficio.service';
import { TripulantesService } from '../../../Services/tripulantes.service';
import { NotificationService } from '../../../utils/notification.service';
import { RouteEncoderService } from '../../../Services/route-encoder.service';

import { Rango } from '../../../model/rango.model';
import { GrupoSanguineo } from '../../../model/grupo-sanguineo.model';
import { Oficio } from '../../../model/oficio.model';
import { Tripulantes } from '../../../model/Tripulantes.model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  rangos: Rango[] = [];
  gruposSanguineos: GrupoSanguineo[] = [];
  oficios: Oficio[] = [];


  hoy: string = new Date().toISOString().substring(0, 10);

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private encoder: RouteEncoderService,
    private rangoService: RangoService,
    private grupoSanguineoService: GrupoSanguineoService,
    private oficioService: OficioService,
    private tripulantesService: TripulantesService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarOpciones();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/)
        ]
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
        ]
      ],
      antiguedad: [
        null,
        [Validators.required, this.rangoAntiguedadValidator()]
      ],
      horas_totales: [0, [Validators.required, Validators.min(0)]],
      permisos: [false],
      grupoSanguineoDTO: this.fb.group({ id: [null, Validators.required] }),
      rangoDTO:           this.fb.group({ id: [null, Validators.required] }),
      oficioDTO:          this.fb.group({ id: [null, Validators.required] })
    });
  }

  private rangoAntiguedadValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) { return null; }   

      const fecha = new Date(valor);
      const min   = new Date('1900-01-01');
      const max   = new Date(this.hoy);

      return (fecha >= min && fecha <= max) ? null : { fueraRango: true };
    };
  }

  private cargarOpciones(): void {
    this.rangoService.getRangos().subscribe(r => this.rangos = r);
    this.grupoSanguineoService.getGruposSanguineos().subscribe(g => this.gruposSanguineos = g);
    this.oficioService.getOficios().subscribe(o => this.oficios = o);
  }

  registrar(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.notification.showMessage('Completa todos los campos obligatorios', 'error');
      return;
    }

    const raw = this.registerForm.value;
    const nuevoTripulante: Tripulantes = {
      ...raw,
      antiguedad: formatDate(raw.antiguedad, 'yyyy-MM-dd', 'en-GB'),
      grupoSanguineoDTO: { id: raw.grupoSanguineoDTO.id } as any,
      rangoDTO:          { id: raw.rangoDTO.id }          as any,
      oficioDTO:         { id: raw.oficioDTO.id }         as any
    };

    this.tripulantesService.createTripulantes(nuevoTripulante).subscribe({
      next: () => {
        this.notification.showMessage('Registro exitoso', 'success');
        this.router.navigate([this.encoder.encode('homePermisos')]);
      },
      error: err => {
        this.notification.showMessage(err?.error?.message || 'Error al registrar', 'error');
      }
    });
  }

  compareById = (a: any, b: any) => a?.id === b?.id;

  goBack(): void {
    this.router.navigate([this.encoder.encode('management')]);
  }
}