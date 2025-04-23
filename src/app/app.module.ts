import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HomePermisosComponent } from './components/homePermisos/homePermisos.component'; 
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { LogrosMedallasComponent } from './components/logros-medallas/logrosMedallas.componet';
import { VuelosComponent } from './components/vuelos/vuelos.component';
import { trigger, transition, style, animate } from '@angular/animations';

import { AppRoutingModule } from './app-routing.module'; 
import { RegisterFlightComponent } from './components/register-flight/register-flight.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomePermisosComponent,
    LoginComponent,
    RegisterUserComponent,
    LogrosMedallasComponent,
    VuelosComponent,
    RegisterFlightComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
