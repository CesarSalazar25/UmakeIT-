import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import {switchMap} from 'rxjs/operators';
import * as firebase from "firebase";
import { User } from "../models/user";
import { Observable , of} from 'rxjs';


@Injectable()
export class AuthService {
  
  User: Observable<User>;

  constructor (
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) 
  {
    //Se comprueba si el usuario esta correctamente logeado en la aplicación:
    this.User = this.afAuth.authState.pipe(switchMap(User => 
    {
      //Usuario conectado:
      if( User )
      {
        return this.firestore.doc<User>(`users/${User.uid}`).valueChanges();
      }
      //Usuario desconectado:
      else 
      {
        return of(null);
      }
    }))
  }

  //Método para usar el inicio de sesión con Google:
  public googleLogin() 
  {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  //Método para iniciar sesión y guardar la información del usuario (Google):
  private oAuthLogin(provider) 
  {
    return this.afAuth.auth.signInWithPopup(provider).then(credentials => {
      const user = credentials.user;
      this.firestore.collection<User>('users', ref => ref.where('email', '==', user.email)).valueChanges()
      .subscribe(data => {
        if(!data.length)
        {
          const newUser = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoUrl: user.photoURL,
            role: 'admin'
          }
          this.firestore.collection('users').doc(user.uid).set(newUser).then(() => {
            this.router.navigate(['/shop']);
            return;
          })
        }
      })
      this.router.navigate(['/shop']);
    })
  }
  
  //Método que actualiza la data del usuario:
  private updateUserData(user){
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoUrl: user.photoURL
    }

    return userRef.set(data);
  }

  //Método para iniciar sesión con email y password:
  public emailAndPassword(email, password)
  {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  //Método para registrar un nuevo usuario:
  public signUp(email, password)
  {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  //Método para cerrar sesión:
  public signOut() 
  {
    this.afAuth.auth.signOut().then(() => 
    this.router.navigate(['/Login']))
  }
}
