import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { HttpModule } from '@angular/http'

import { APP_ROUTING } from './app.routes';
import { AppComponent } from './app.component';
import {environment} from '../environments/environment'

//FireBase Module
import {AngularFireModule} from 'angularfire2';
import{AngularFirestoreModule} from 'angularfire2/firestore';

//Modulos de la aplicación
import { AuthModule } from './auth/auth.module';
//import { AdminModule } from './admin/admin.module';

//Componentes
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';

//Modulos de ngx-boostrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse'
import { ModalModule } from 'ngx-bootstrap/modal';
import { ShopComponent } from './components/shop/shop.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    ShopComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    BrowserModule,
    APP_ROUTING,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AuthModule
    //AdminModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
