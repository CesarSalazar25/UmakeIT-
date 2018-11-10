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

  constructor(public auth: AuthService, public user: UserService, public afAuth: AngularFireAuth, private firestore: AngularFirestore, private storage: AngularFireStorage) 
  { 
  }

  ngOnInit() {}

  updateProfile(form: NgForm)
  {

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
  prueba(){
    //Aca le meto el bowe a la imagen :'v 
    //ImageUrl tiene el url de descarga de la imagen, que debe ser asignada luego
    //Cesar Gay
    // console.log(this.imageUrl);
    // console.log(this.ref.getMetadata());
    // console.log(this.ref);
    //this.ref.delete();
  //  this.storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/tupedido-backend.appspot.com/o/Im%C3%A1genes%2Fuser_avatars%2Fgfn5okjmidb?alt=media&token=d81092a8-ea80-43e8-b20a-f593709991d9').delete().toPromise().then( () => {
  //    alert("Sera que yes ?");
  //   }).catch( err => {
  //     alert(err.message);
  //   })
  console.log(this.storage.refFromURL(this.imageUrl));
  }
}
