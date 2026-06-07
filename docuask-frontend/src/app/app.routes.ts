import { Router, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { inject } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
   { path: 'login', component: LoginComponent },  
  { path: 'dashboard', component: DashboardComponent, 
    canActivate: [() => {
    const token = localStorage.getItem('token');
    if (!token) {
      inject(Router).navigate(['/login']);
      return false;
    }
    return true;
  }] },
];