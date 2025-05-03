import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HomePermisosComponent } from './components/homePermisos/homePermisos.component'; 
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/managements/register-user/register-user.component';
import { LogrosMedallasComponent } from './components/logros-medallas/logrosMedallas.componet';
import { VuelosComponent } from './components/vuelos/vuelos.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './components/managements/edit-user/edit-user.component';

import { AppRoutingModule } from './app-routing.module'; 
import { RegisterFlightComponent } from './components/register-flight/register-flight.component';
import { HistorialFlightsComponent } from './components/historial-flights/historial-flights.component';
import { ViewFlightComponent } from './components/view-flight/view-flight.component';
import { ControllerMedallasComponent } from './components/managements/controller-medallas/controller-medallas.component';
import { CreateJobComponent } from './components/managements/register-job/create-job.component';
import { EditJobComponent } from './components/managements/edit-job/edit-job.component';
import { CreateItineraryComponent } from './components/managements/create-itinerary/create-itinerary.component';
import { DestinosComponent } from './components/destinos/destinos.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    DestinosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule, 
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
