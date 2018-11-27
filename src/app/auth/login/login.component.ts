import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Title } from "@angular/platform-browser";
import { Router} from "@angular/router";
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';

export class AuthLogin {
  constructor(
    public email: string,
    public password: string
  ){}
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.styles.css']
})
export class LoginComponent {

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }
  ngOnInit(){

  }

  //Se leen los datos puestos y llama al método que inicia la sesión:
  login(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.auth.emailAndPassword(email, password).then(credentials => {
      this.router.navigate(['/dashboard/home'])

    }).catch(err => {
      alert(err.message);
    })
  }

}
