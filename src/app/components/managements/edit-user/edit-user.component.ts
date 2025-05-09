import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripulantesService } from '../../../Services/tripulantes.service';
import { RangoService } from '../../../Services/rango.service';
import { GrupoSanguineoService } from '../../../Services/grupo-sanguineo.service';
import { OficioService } from '../../../Services/oficio.service';
import { NotificationService } from '../../../utils/notification.service';
import { Tripulantes } from '../../../model/Tripulantes.model';
import { Rango } from '../../../model/rango.model';
import { GrupoSanguineo } from '../../../model/grupo-sanguineo.model';
import { Oficio } from '../../../model/oficio.model';
import { RouteEncoderService } from '../../../Services/route-encoder.service';

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
      nombre: ['',[Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/)]],
      apellidos: ['',[ Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/)]],
      email: ['',[Validators.required,Validators.email]],
      contrasena: ['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]],
      antiguedad: [null, [Validators.required, this.AntiguedadValidator()]],
      horas_totales: [ 0,[ Validators.required, Validators.min(0)]],
      permisos: [false],
      grupoSanguineoDTO: this.fb.group({ id: [null, Validators.required] }),
      rangoDTO:           this.fb.group({ id: [null, Validators.required] }),
      oficioDTO:          this.fb.group({ id: [null, Validators.required] }),
    });
  }

  private loadAllUsers(): void {
    this.tripService.getAll().subscribe({
      next: (users) => {
        this.usuarios = users;
      },
      error: (err) => {
        this.notification.showMessage('Error cargando lista de usuarios', 'error');
      }
    });
  }

  onUserSelected(): void {
    if (this.selectedUserId) {
      this.loadUser(this.selectedUserId);
    } else {
      this.userForm.reset();   // vacía el formulario
      this.isLoaded = false;   // evita que se envíe hasta que cargue un usuario válido
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
    this.userForm.patchValue({
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
      contrasena: u.contrasena,
      antiguedad: u.antiguedad,
      horas_totales: u.horas_totales,
      permisos: u.permisos,
      grupoSanguineoDTO: { id: u.grupoSanguineoDTO.id },
      rangoDTO: { id: u.rangoDTO.id },
      oficioDTO: { id: u.oficioDTO.id },
    });
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
    return {
      ...this.userForm.value,
      id: this.selectedUserId,
      grupoSanguineoDTO: { id: this.userForm.value.grupoSanguineoDTO.id },
      rangoDTO: { id: this.userForm.value.rangoDTO.id },
      oficioDTO: { id: this.userForm.value.oficioDTO.id },
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
    this.router.navigate([ this.encoder.encode('management') ]);
  }

  private AntiguedadValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) { return null; }

      const fecha = new Date(valor);
      const min   = new Date('1900-01-01');
      const max   = new Date(this.hoy);

      return (fecha >= min && fecha <= max) ? null : { fueraRango: true };
    };
  }
}