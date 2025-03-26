import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';    
import { HttpClientModule } from '@angular/common/http';   
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },

];

@NgModule({
  declarations: [
    AppComponent,      
    HomeComponent,    
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule, 
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]  
})
export class AppModule {}
