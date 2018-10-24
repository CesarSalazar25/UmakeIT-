import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Router:
import { AuthRoutingModule } from './auth-routing.module';

//Servicios:
import { AuthService } from './auth.service';

//Firebase:
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';

//Componentes:
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    AngularFireAuthModule,
    FormsModule
  ],
  declarations: [RegisterComponent, LoginComponent, ForgotComponent],
  providers: [AuthService, AuthGuard]
})
export class AuthModule { }
