import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ShopComponent } from './components/shop/shop.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
//import { AdminComponent } from './admin/admin/admin.component';
import { AuthGuard } from './auth/auth.guard';

const ROUTES: Routes = [
    { path: 'dashboard', component:DashboardComponent, 
      children: [
        {path: 'shop', component: ShopComponent},
        //{path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}
      ] 
    }
];

export const APP_ROUTING= RouterModule.forRoot(ROUTES);