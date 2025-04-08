import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomePermisosComponent } from './homePermisos/homePermisos.component'; // Removed or commented out due to missing definition
import { LoginComponent } from './login/login.component';
import { RegisterUserComponent } from './register-user/register-user.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'homePermisos', component: HomePermisosComponent }, // Removed or commented out due to missing definition
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: '**', redirectTo: 'login' }
];

const routeAnimations = trigger('routeAnimations', [
  transition('login => register', [
    style({ position: 'relative' }),
    animate('600ms ease', style({ transform: 'rotateY(180deg)' }))
  ]),
  transition('login => home', [
    style({ position: 'relative' }),
    animate('600ms ease', style({ transform: 'rotateY(-180deg)' }))
  ]),
  transition('login => homePermisos', [
    style({ position: 'relative' }),
    animate('600ms ease', style({ transform: 'rotateY(-180deg)' }))
  ]),
  transition('register => login', [
    style({ position: 'relative' }),
    animate('600ms ease', style({ transform: 'rotateY(-180deg)' }))
  ])
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterUserComponent,
    HomePermisosComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
