import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

//Componentes:
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ShopComponent } from './components/shop/shop.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CarritoComponent } from './components/carrito/carrito.component';

//Router:
import { APP_ROUTING } from './app.routes';

//Módulos:
import { AuthModule } from './auth/auth.module';

//Servicios:

//Pipes:

//Firebase:
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

//Componentes de Ngx-Bootstrap:
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ShopComponent,
    OrdersComponent,
    CarritoComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    FormsModule,
    HttpModule,
    APP_ROUTING,
    BsDropdownModule.forRoot(),
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
