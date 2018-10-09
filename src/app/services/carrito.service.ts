import { Injectable, Input } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  CarritoProductsCollection: AngularFirestoreCollection<Product>;
  CarritoProductDoc: AngularFirestoreDocument<Product>;
  productos: Observable<Product[]>;
  carrito: Observable<Product>;
  UserId: string;
  carritoId: string;
  constructor(private afs: AngularFirestore) { 
    //De momento solo funciona con anaGuzman@outlook.com
    //Asigno el id del usuario al id que tiene Ana
    this.UserId = "uPiK270MT2WPRdgGfTHUz0PrN2e2";
    this.CarritoProductsCollection = this.afs.collection('users').doc(this.UserId).collection('carrito');
  }
  getCarrito(): Observable<Product[]>{
    //Asigno el id del carrito al que posee Ana
    //this.carritoId = "Y9fjw8RU7Y0PqKv66sSK";
    this.productos = this.CarritoProductsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Product;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
    return this.productos;
  }
}
