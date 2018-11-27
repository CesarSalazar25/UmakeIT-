import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit 
{

  uploadProgress: Observable<number>; 
  ref: AngularFireStorageReference;
  downloadURL: Observable<string>;
  imageUrl: string = null;
  oldimageUrl: string = null;
  selectedUser: User;

  constructor(public auth: AuthService, public user: UserService, public afAuth: AngularFireAuth, private firestore: AngularFirestore, private storage: AngularFireStorage) 
  { 
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.auth.User.subscribe(user => { this.selectedUser = user });
  }

  updateProfile(name: HTMLInputElement, email: HTMLInputElement, pass: HTMLInputElement, nuevo: HTMLInputElement)
  {
    if(pass.value !=""){
      this.reautenticate(pass.value).then(() => {
        var user = this.afAuth.auth.currentUser;
        if(nuevo.value != ""){
          user.updatePassword(nuevo.value).then(()=> {
            alert("Password was changed");
          }).catch((error => {
            alert(error.message);
          }));
        }
        if(name.value != "" && this.imageUrl != null){
          var Profile ={
            displayName: name.value,
            photoURL: this.imageUrl
          }
          user.updateProfile(Profile).then(() => {
            console.log("Se actualizo el profile");
            this.selectedUser.name = name.value;
            this.selectedUser.photoUrl = this.imageUrl;
            this.auth.updateUserData(this.selectedUser);
          }).catch((error) => {
            alert(error.message);
          })
        }else if(name.value == "" && this.imageUrl != null){
          var Profile ={
            displayName: this.selectedUser.name,
            photoURL: this.imageUrl
          }
          user.updateProfile(Profile).then(() => {
            console.log("Se actualizo el profile");
            this.selectedUser.photoUrl = this.imageUrl;
            this.auth.updateUserData(this.selectedUser);
          }).catch((error) => {
            alert(error.message);
          })
        }else if(name.value != "" && this.imageUrl == null){
          var Profile ={
            displayName: name.value,
            photoURL: this.selectedUser.photoUrl
          }
          user.updateProfile(Profile).then(() => {
            console.log("Se actualizo el profile");
            this.selectedUser.name = name.value;
            this.auth.updateUserData(this.selectedUser);
          }).catch((error) => {
            alert(error.message);
          })
        }
        if(email.value != ""){
          user.updateEmail(email.value).then(()=>{
            console.log("Se actualizo el email");
            this.selectedUser.email = email.value;
            this.auth.updateUserData(this.selectedUser);
          }).catch((error) => {
            alert(error.message);
          })
        }
      }).catch((error) => {
        alert(error.message);
      });
    }else{
      alert("Para realizar cualquier cambio necesita poner su contraseña actual")
      return; 
    }

    // if(name.value != ""){
    //   if(this.imageUrl != null){
    //     console.log("se hizo update de nombre e imagen")
    //     user.updateProfile({
    //       displayName: name.value,
    //       photoURL: this.imageUrl
    //     }).then(function() {
    //       // Update successful.
    //     }).catch(function(error) {
    //       // An error happened.
    //     });
    //   }else {
    //     console.log("update de nombre y no imagen")
    //     user.updateProfile({
    //       displayName: name.value,
    //       photoURL: this.selectedUser.photoUrl
    //     }).then(function() {
    //       // Update successful.
    //     }).catch(function(error) {
    //       // An error happened.
    //     });
    //   }
    // }else {
    //   if(this.imageUrl != null){
    //     console.log("update de imagen y no nombre")
    //     user.updateProfile({
    //       displayName: this.selectedUser.name,
    //       photoURL: this.imageUrl
    //     }).then(function() {
    //       // Update successful.
    //     }).catch(function(error) {
    //       // An error happened.
    //     });
    //   }
    // }
    // if(nuevo.value != ""){
    //     console.log(pass.value);
    //     console.log("update de password");
    //     user.updatePassword(pass.value);
    // }
    // if(email.value != ""){
    //   user.updateEmail(email.value);
    // }

  }
  reautenticate(pass){
    var user = this.afAuth.auth.currentUser;
    var credential = auth.EmailAuthProvider.credential(user.email, pass);
    return user.reauthenticateWithCredential(credential);
  }
  upload(event) 
  {
    // Obtiene la imagen:
    const file = event.target.files[0];

    // Genera un ID random para la imagen:
    const randomId = Math.random().toString(36).substring(2);
    const filepath = `Imágenes/user_avatars/${randomId}`;

    // Cargar imagen:
    const task = this.storage.upload(filepath, file);
    this.ref = this.storage.ref(filepath);
    //console.log(this.ref.getMetadata())
    // Observa los cambios en el % de la barra de progresos:
    this.uploadProgress = task.percentageChanges();
    // Notifica cuando la URL de descarga está disponible:
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();  
        this.downloadURL.subscribe(url => {this.imageUrl = url });
      })
    ).subscribe();
  }

  deleteImage(urlToDelete: string)
  {
    this.storage.refFromURL(urlToDelete).delete().toPromise().then( () => {
      // Successfully deleted
      }).catch( err => {
        // Handle err
    });
  }

}
