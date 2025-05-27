import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { map, first } from 'rxjs/operators';
import { of } from 'rxjs';

import { TripulantesService } from '../../../../Services/tripulantes.service';
import { RangoService } from '../../../../Services/rango.service';
import { GrupoSanguineoService } from '../../../../Services/grupo-sanguineo.service';
import { OficioService } from '../../../../Services/oficio.service';
import { NotificationService } from '../../../../utils/notification.service';
import { RouteEncoderService } from '../../../../Services/route-encoder.service';

import { Tripulantes } from '../../../../model/Tripulantes.model';
import { Rango } from '../../../../model/rango.model';
import { GrupoSanguineo } from '../../../../model/grupo-sanguineo.model';
import { Oficio } from '../../../../model/oficio.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm!: FormGroup;
  rangos: Rango[] = [];
  gruposSanguineos: GrupoSanguineo[] = [];
  oficios: Oficio[] = [];
  usuarios: Tripulantes[] = [];
  selectedUserId: number | null = null;
  isLoaded = false;
  hoy: string = new Date().toISOString().substring(0, 10);
  showPassword = false;

  originalEmail: string = '';

  constructor(
    private encoder: RouteEncoderService,
    private fb: FormBuilder,
    private tripService: TripulantesService,
    private rangoService: RangoService,
    private grupoSangService: GrupoSanguineoService,
    private oficioService: OficioService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSelectOptions();
    this.loadAllUsers();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/)]],
      email: ['', [Validators.required, Validators.email], [this.emailUniqueValidator()]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]],
      antiguedad: [null, [Validators.required, this.AntiguedadValidator()]],
      horas: [0, [Validators.required, Validators.min(0)]],
      minutos: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      permisos: [false],
      grupoSanguineoDTO: this.fb.group({ id: [null, Validators.required] }),
      rangoDTO: this.fb.group({ id: [null, Validators.required] }),
      oficioDTO: this.fb.group({ id: [null, Validators.required] }),
    });
  }

  private loadAllUsers(): void {
    this.tripService.getAll().subscribe({
      next: (users) => {
        this.usuarios = users;
      },
      error: () => {
        this.notification.showMessage('Error cargando lista de usuarios', 'error');
      }
    });
  }

  onUserSelected(): void {
    if (this.selectedUserId) {
      this.loadUser(this.selectedUserId);
    } else {
      this.userForm.reset();
      this.isLoaded = false;
    }
  }

  private loadUser(userId: number): void {
    this.tripService.getById(userId).subscribe({
      next: (u) => {
        if (!u) {
          this.handleInvalidUser();
          return;
        }
        this.patchFormValues(u);
        this.isLoaded = true;
      },
      error: () => this.handleInvalidUser()
    });
  }

  private handleInvalidUser(): void {
    this.notification.showMessage('Usuario no encontrado', 'error');
    this.router.navigate(['/homePermisos']);
  }

  private patchFormValues(u: Tripulantes): void {
    const [hh, mm] = String(u.horas_totales || '00:00').split(':');

    this.originalEmail = u.email;

    this.userForm.patchValue({
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
      contrasena: u.contrasena,
      antiguedad: u.antiguedad,
      horas: +hh,
      minutos: +mm,
      permisos: u.permisos,
      grupoSanguineoDTO: { id: u.grupoSanguineoDTO.id },
      rangoDTO: { id: u.rangoDTO.id },
      oficioDTO: { id: u.oficioDTO.id },
    });

    const passCtrl = this.userForm.get('contrasena');
    passCtrl?.markAsDirty();
    passCtrl?.markAsTouched();
    passCtrl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.isLoaded || this.userForm.invalid) {
      this.notification.showMessage('Datos incompletos o inválidos', 'error');
      return;
    }

    const updatedUser = this.prepareUpdateData();
    this.updateUser(updatedUser);
  }

  private loadSelectOptions(): void {
    this.rangoService.getRangos().subscribe(r => this.rangos = r);
    this.grupoSangService.getGruposSanguineos().subscribe(g => this.gruposSanguineos = g);
    this.oficioService.getOficios().subscribe(o => this.oficios = o);
  }

  private prepareUpdateData(): Tripulantes {
    const raw = this.userForm.value;
    const hh = String(raw.horas).padStart(2, '0');
    const mm = String(raw.minutos).padStart(2, '0');

    return {
      ...raw,
      id: this.selectedUserId,
      horas_totales: `${hh}:${mm}`,
      grupoSanguineoDTO: { id: raw.grupoSanguineoDTO.id },
      rangoDTO: { id: raw.rangoDTO.id },
      oficioDTO: { id: raw.oficioDTO.id },
    };
  }

  private updateUser(updatedUser: Tripulantes): void {
    if (!this.selectedUserId) return;

    this.tripService.updateTripulante(this.selectedUserId, updatedUser).subscribe({
      next: () => {
        this.notification.showMessage('Usuario actualizado con éxito', 'success');
        this.router.navigate([this.encoder.encode('management')]);
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Error actualizando usuario';
        this.notification.showMessage(errorMessage, 'error');
      }
    });
  }

  goBack(): void {
    this.router.navigate([this.encoder.encode('management')]);
  }

  private AntiguedadValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) return null;

      const fecha = new Date(valor);
      const min = new Date('1900-01-01');
      const max = new Date(this.hoy);

      return (fecha >= min && fecha <= max) ? null : { fueraRango: true };
    };
  }

  private emailUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value?.trim();
      if (!value) return of(null);

      // Permitir el email original del usuario sin validación extra
      if (value === this.originalEmail) return of(null);

      return this.tripService.emailExists(value).pipe(
        map(exists => (exists ? { emailTaken: true } : null)),
        first()
      );
    };
  }
}
