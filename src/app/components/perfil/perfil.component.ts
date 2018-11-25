import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { TouchSequence } from 'selenium-webdriver';
import { User } from '../../models/user';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

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

  updateProfile(form: NgForm)
  {

    if(form.value.name != ""){
      console.log(form.value.name);
      this.selectedUser.name = form.value.name;
    }

    if(this.imageUrl!=null)
    {
      this.oldimageUrl=this.selectedUser.photoUrl;
      this.selectedUser.photoUrl=this.imageUrl;
      this.deleteImage(this.oldimageUrl);
      this.imageUrl=null;
    }
    console.log(this.selectedUser);
    this.user.updateUser(this.selectedUser);
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

  prueba()
  {
    console.log(this.selectedUser);
  }

}
