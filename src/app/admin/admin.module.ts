import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { ProductsFormComponent } from './products-form/products-form.component';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from './products/products.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgModel,
    FormsModule
  ],
  declarations: [AdminComponent, ProductsFormComponent, ProductsComponent],
  entryComponents: [ProductsFormComponent]
})
export class AdminModule { }
