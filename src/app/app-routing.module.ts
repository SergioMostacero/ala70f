// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/managements/register-user/register-user.component';
import { HomeComponent } from './components/home/home.component';
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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { animation: 'login' } },
  { path: 'register', component: RegisterUserComponent, data: { animation: 'register' } },
  { path: 'home', component: HomeComponent, data: { animation: 'home' } },
  { path: 'homePermisos', component: HomePermisosComponent, data: { animation: 'homePermisos' } },
  { path: 'logros-medallas', component: LogrosMedallasComponent },
  { path: 'management', component: ManagementComponent },
  { path: 'create-user', component: RegisterUserComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'flights', component: VuelosComponent },
  { path: 'register-flights', component: RegisterFlightComponent },
  { path: 'historial', component: HistorialFlightsComponent },
  { path: 'vuelo/:id', component: ViewFlightComponent }, // Asegúrate que el componente exista
  { path: 'controller-medallas', component: ControllerMedallasComponent },
  { path: 'create-job', component: CreateJobComponent },
  { path: 'edit-job', component: EditJobComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
