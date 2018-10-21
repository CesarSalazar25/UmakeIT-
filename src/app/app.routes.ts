import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//Firebase:
import { AuthGuard } from './auth/auth.guard';

//Componentes:
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ShopComponent } from './components/shop/shop.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ComprasComponent } from './components/compras/compras.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PersonalizarComponent } from './components/personalizar/personalizar.component';

const ROUTES: Routes = [
    { path: 'dashboard', component: DashboardComponent,
      children: [
        {path: 'shop', component: ShopComponent},
        {path: 'home', component: HomeComponent},
        {path: 'carrito', component: CarritoComponent},
        {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
        { path: 'compras', component:ComprasComponent },
        { path: 'perfil', component: PerfilComponent },
        { path: 'personalize', component: PersonalizarComponent }
      ]
    //{path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}
  },
  { path: '**', pathMatch: 'full', redirectTo: 'dashboard/shop' }
];

export const APP_ROUTING= RouterModule.forRoot(ROUTES);