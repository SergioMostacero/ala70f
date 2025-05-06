// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/managements/register-user/register-user.component';
import { HomePermisosComponent } from './components/homePermisos/homePermisos.component';
import { LogrosMedallasComponent } from './components/logros-medallas/logrosMedallas.componet';
import { ManagementComponent } from './components/managements/management/management.component';
import { EditUserComponent } from './components/managements/edit-user/edit-user.component';
import { VuelosComponent } from './components/vuelos/vuelos.component';
import { RegisterFlightComponent } from './components/register-flight/register-flight.component';
import { HistorialFlightsComponent } from './components/historial-flights/historial-flights.component';
import { ViewFlightComponent } from './components/view-flight/view-flight.component';
import { ControllerMedallasComponent } from './components/managements/controller-medallas/controller-medallas.component';
import { CreateJobComponent } from './components/managements/register-job/create-job.component';
import { EditJobComponent } from './components/managements/edit-job/edit-job.component';
import { CreateItineraryComponent } from './components/managements/create-itinerary/create-itinerary.component';
import { DestinosComponent } from './components/destinos/destinos.component';
import { RouteEncoderService } from './Services/route-encoder.service';


const encoder = new RouteEncoderService();
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
  { path: `${encodedVuelo}/:id`, 
    component: ViewFlightComponent,
    data: { originalPath: 'vuelo' }
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
