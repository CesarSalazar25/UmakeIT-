import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

//Componentes:
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ShopComponent } from './components/shop/shop.component';
import { HomeComponent } from './components/home/home.component';

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
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FooterComponent } from './components/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ShopComponent,
    SidebarComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    FormsModule,
    HttpModule,
    APP_ROUTING,
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
