import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//Firebase:
import { AuthGuard } from './auth/auth.guard';

//Componentes:
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ShopComponent } from './components/shop/shop.component';
import { HomeComponent } from './components/home/home.component';

const ROUTES: Routes = [
    { path: 'dashboard', component: DashboardComponent,
      children: [
        {path: 'shop', component: ShopComponent},
        {path: 'home', component: HomeComponent}
      ]
    //{path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}
  }
];

export const APP_ROUTING= RouterModule.forRoot(ROUTES);