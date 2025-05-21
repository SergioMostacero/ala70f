import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { HomePermisosComponent } from './components/homePermisos/homePermisos.component'; 
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/managements/register-user/register-user.component';
import { LogrosMedallasComponent } from './components/logros-medallas/logrosMedallas.componet';
import { VuelosComponent } from './components/vuelos-management/vuelos/vuelos.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './components/managements/edit-user/edit-user.component';

import { AppRoutingModule } from './app-routing.module'; 
import { RegisterFlightComponent } from './components/vuelos-management/register-flight/register-flight.component';
import { HistorialFlightsComponent } from './components/vuelos-management/historial-flights/historial-flights.component';
import { ViewFlightComponent } from './components/vuelos-management/view-flight/view-flight.component';
import { ControllerMedallasComponent } from './components/managements/controller-medallas/controller-medallas.component';
import { CreateJobComponent } from './components/managements/register-job/create-job.component';
import { EditJobComponent } from './components/managements/edit-job/edit-job.component';
import { CreateItineraryComponent } from './components/managements/create-itinerary/create-itinerary.component';
import { DestinosComponent } from './components/destinos/destinos.component';
import { EditarVueloComponent } from './components/vuelos-management/editar-vuelos/editar-vuelo.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePermisosComponent,
    LoginComponent,
    RegisterUserComponent,
    LogrosMedallasComponent,
    VuelosComponent,
    RegisterFlightComponent,
    HistorialFlightsComponent,
    ViewFlightComponent,
    ControllerMedallasComponent,
    EditUserComponent,
    CreateJobComponent,
    EditJobComponent,
    CreateItineraryComponent,
    DestinosComponent,
    EditarVueloComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule, 
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      registrationStrategy: 'registerWhenStable:30000' // Espera 30 segundos para registrar
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
