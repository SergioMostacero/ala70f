import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Oficio } from '../../../model/oficio.model';
import { OficioService } from '../../../Services/oficio.service';
import { RouteEncoderService } from '../../../Services/route-encoder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent implements OnInit {
  oficios: Oficio[] = [];
  oficio?: Oficio;
  @Output() saved = new EventEmitter<Oficio>();
  form!: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private encoder: RouteEncoderService,
    private fb: FormBuilder,
    private oficioService: OficioService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadOficios();            
  }

  goBack(): void {
    const encoder = new RouteEncoderService();
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    
    const ruta = tienePermisos 
      ? encoder.encode('management') 
      : encoder.encode('home');
  
    this.router.navigate([ruta]);
  }

  private buildForm(oficio?: Oficio): void {
    this.form = this.fb.group({
      nombre: [oficio?.nombre ?? '', [Validators.required, Validators.maxLength(60)]],
      descripcion: [oficio?.descripcion ?? '', [Validators.required, Validators.maxLength(255)]]
    });
  }

  private loadOficios(): void {
    this.oficioService.getOficios().subscribe({
      next: data => this.oficios = data,
      error: err  => console.error(err)
    });
  }

  onSelect(idString: string): void {
    const id = +idString;
    if (id === 0) {                    
      this.oficio = undefined;
      this.buildForm();                
    } else {
      this.oficio = this.oficios.find(o => o.id === id);
      this.buildForm(this.oficio);      
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const data: Oficio = { ...this.oficio, ...this.form.value };
    this.loading = true;

    const request$ = data.id
      ? this.oficioService.updateOficio(data)
      : this.oficioService.createOficio(data);

    request$.subscribe({
      next: resp => {
        this.saved.emit(resp);
        this.loadOficios();           
        this.onSelect('0');      
      },
      error: err => console.error(err),
      complete: () => (this.loading = false)
    });
  }
}