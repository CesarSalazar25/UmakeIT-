import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit 
{

  uploadProgress: Observable<number>;
  uploadURL: Observable<string>;
  
  constructor(public auth: AuthService, public user: UserService, public afAuth: AngularFireAuth, private firestore: AngularFirestore, private storage: AngularFireStorage) 
  { 
  }

  ngOnInit() {}

  updateProfile(form: NgForm)
  {
    console.log(form.value);
  }

  //Sube una foto desde tu PC y la monta en Firebase Storage:
  upload(event) 
  {
    // Obtiene la imagen:
    const file = event.target.files[0];

    // Genera un ID random para la imagen:
    const randomId = Math.random().toString(36).substring(2);
    console.log(randomId);
    const filepath = `Imágenes/user_avatars/${randomId}`;

    const fileRef = this.storage.ref(filepath);

    // Cargar imagen:
    const task = this.storage.upload(filepath, file);

    // Observa los cambios en el % de la barra de progresos:
    this.uploadProgress = task.percentageChanges();

    // Notifica cuando la URL de descarga está disponible:
    task.snapshotChanges().pipe(
      finalize(() => {
        this.uploadURL = fileRef.getDownloadURL();     
      })
    ).subscribe();

    

  }

  

}
