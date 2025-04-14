// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { HomeComponent } from './home/home.component';
import { HomePermisosComponent } from './homePermisos/homePermisos.component';
import { LogrosMedallasComponent } from './logros-medallas/logrosMedallas.componet';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { animation: 'login' } },
  { path: 'register', component: RegisterUserComponent, data: { animation: 'register' } },
  { path: 'home', component: HomeComponent, data: { animation: 'home' } },
  { path: 'homePermisos', component: HomePermisosComponent, data: { animation: 'homePermisos' } },
  { path: 'logros-medallas', component: LogrosMedallasComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
