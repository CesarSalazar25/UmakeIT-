import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user;
  constructor(public auth: AuthService,
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore) { }

  ngOnInit() {
  }

  updateProfile(form: NgForm){
    console.log(form.value);
  }

}
