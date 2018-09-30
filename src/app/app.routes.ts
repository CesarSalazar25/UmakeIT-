import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ShopComponent } from './components/shop/shop.component';

const ROUTES: Routes = [
    { path: 'shop', component:ShopComponent },
    { path: '**', pathMatch:'full', redirectTo: 'shop' }
];

export const APP_ROUTING= RouterModule.forRoot(ROUTES);