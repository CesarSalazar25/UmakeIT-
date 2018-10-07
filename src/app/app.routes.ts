import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ShopComponent } from './components/shop/shop.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CarritoComponent } from './components/carrito/carrito.component';
//import { AdminComponent } from './admin/admin/admin.component';
import { AuthGuard } from './auth/auth.guard';

const ROUTES: Routes = [
    { path: 'dashboard', component:DashboardComponent, 
      children: [
        {path: 'shop', component: ShopComponent},
        {path: 'orders', component:  OrdersComponent},
        {path: 'carrito', component: CarritoComponent}
        //{path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}
      ] 
    }
];

export const APP_ROUTING= RouterModule.forRoot(ROUTES);