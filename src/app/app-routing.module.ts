import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/managements/users/register-user/register-user.component';
import { HomePermisosComponent } from './components/homePermisos/homePermisos.component';
import { LogrosMedallasComponent } from './components/logros-medallas/logrosMedallas.componet';
import { ManagementComponent } from './components/managements/management/management.component';
import { EditUserComponent } from './components/managements/users/edit-user/edit-user.component';
import { VuelosComponent } from './components/vuelos-management/vuelos/vuelos.component';
import { RegisterFlightComponent } from './components/vuelos-management/register-flight/register-flight.component';
import { HistorialFlightsComponent } from './components/vuelos-management/historial-flights/historial-flights.component';
import { ViewFlightComponent } from './components/vuelos-management/view-flight/view-flight.component';
import { ControllerMedallasComponent } from './components/managements/medallas/controller-medallas/controller-medallas.component';
import { CreateJobComponent } from './components/managements/job/register-job/create-job.component';
import { EditJobComponent } from './components/managements/job/edit-job/edit-job.component';
import { CreateItineraryComponent } from './components/managements/create-itinerary/create-itinerary.component';
import { DestinosComponent } from './components/destinos/destinos.component';
import { RouteEncoderService } from './Services/route-encoder.service';
import { EditarVueloComponent } from './components/vuelos-management/editar-vuelos/editar-vuelo.component';
import { PlaneFormComponent } from './components/managements/planes/plane-form.component';
import { MissionsComponent } from './components/managements/missions/missions.component';
import { EditMedallasComponent } from './components/managements/medallas/edit-medallas/edit-medallas.component';


const encoder = new RouteEncoderService();
const P = encoder.encode('plane');
const M = encoder.encode('missions');
const MD      = encoder.encode('medallas');   
const encodedVuelo = encoder.encode('vuelo');
const routes: Routes = [
  { path: '', redirectTo: encoder.encode('login'), pathMatch: 'full' },
  { path: encoder.encode('login'), component: LoginComponent, data: { animation: 'login' } },
  { path: encoder.encode('register'), component: RegisterUserComponent, data: { animation: 'register' } },
  { path: encoder.encode('homePermisos'), component: HomePermisosComponent, data: { animation: 'homePermisos' } },
  { path: encoder.encode('logros-medallas'), component: LogrosMedallasComponent },
  { path: encoder.encode('management'), component: ManagementComponent },
  { path: encoder.encode('create-user'), component: RegisterUserComponent },
  { path: encoder.encode('edit-user'), component: EditUserComponent },
  { path: encoder.encode('flights'), component: VuelosComponent },
  { path: encoder.encode('register-flights'), component: RegisterFlightComponent },
  { path: encoder.encode('historial'), component: HistorialFlightsComponent },
  { path: encoder.encode('vuelo/:id'), component: ViewFlightComponent }, // Asegúrate que el componente exista
  { path: encoder.encode('controller-medallas'), component: ControllerMedallasComponent },
  { path: encoder.encode('create-job'), component: CreateJobComponent },
  { path: encoder.encode('edit-job'), component: EditJobComponent },
  { path: encoder.encode('create-itinerary'), component: CreateItineraryComponent},
  { path: encoder.encode('destinos'), component: DestinosComponent},
  { path: P,               component: PlaneFormComponent },
  { path: `${P}/new`,      component: PlaneFormComponent },
  { path: `${P}/:id`,      component: PlaneFormComponent },
  { path: M, component: MissionsComponent },
  { path: MD, component: EditMedallasComponent },
  { path: `${encoder.encode('editar-vuelo')}/:id`, component: EditarVueloComponent },
  { path: `${encodedVuelo}/:id`, component: ViewFlightComponent,data: { originalPath: 'vuelo' }},
  
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
