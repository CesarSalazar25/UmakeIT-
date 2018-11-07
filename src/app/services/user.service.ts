import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  users: Observable<User[]>;
  user: Observable<User>;

  constructor(private afs: AngularFirestore) 
  { 
    this.userCollection = this.afs.collection('users', ref => ref);
  }

  //Crear Usuario:
  crearUser(user: User)
  {
    this.userCollection.add(user);
  }

  //Obtener Usuario:
  getProductos():Observable<User[]>
  {
    this.users = this.userCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
          const data = action.payload.doc.data() as User;
          data.uid = action.payload.doc.id;
          return data;
      });
    }));
    return this.users;
  }

  //Obtener usuario:
  getUser( idUser: string)
  {
    this.userDoc = this.afs.doc<User>(`users/${idUser}`);
    this.user = this.userDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists == false){
        return null;
      }else{
        const data = action.payload.data() as User;
        data.uid = action.payload.id;
        return data;
      }
    }));
    return this.user;
  }

  //Actualizar usuario:
  updateUser(user: User)
  {
    this.userDoc = this.afs.doc(`users/${user.uid}`);
    this.userDoc.update(user);
  }
  //Borrar usuario:
  deleteUser(user: User){
    this.userDoc = this.afs.doc(`users/${user.uid}`);
    this.userDoc.delete();
  }


}
