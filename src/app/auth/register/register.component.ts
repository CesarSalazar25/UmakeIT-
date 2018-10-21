import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Title } from "@angular/platform-browser";
import { Router} from "@angular/router";
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.styles.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    public title: Title,
    public router: Router,
  ) { }

  ngOnInit() {
    this.title.setTitle('Registro');
  }

  public onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.auth.signUp(email, password).then((userCredentials) => {
      const FireUser = userCredentials.user;
      alert("Registro Exitoso");

      const data = {
        uid: FireUser.uid,
        email: email,
        name: email,
        photoUrl: null,
        role: 'customer'
      };
    
      this.afs.collection('users').doc(FireUser.uid).set(data)
      .then(()=> {
        this.auth.emailAndPassword(email, password).then(() => {
          this.router.navigate(['/dashboard/shop]']);
        }).catch(err => {
          alert(err.message);
        })
      }).catch(err => {
        alert(err.message);
      })
    }).catch(err => {
      alert(err.message);
    })
  } 
}
