import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import {Order} from "../models/order";
import { Observable } from 'rxjs';
import * as faker from 'faker';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  orderCollection: AngularFirestoreCollection<Order>;
  orderDoc: AngularFirestoreDocument<Order>;
  orders: Observable<Order[]>;
  order: Observable<Order>;
  constructor( private afs: AngularFirestore) {
      this.orderCollection = this.afs.collection<Order>('orders', ref => ref);
   }
  
  InitializeCollectionUid(uid?: string){
    if(uid){
      this.orderCollection = this.afs.collection<Order>('orders', ref => ref.where('uid', '==', uid));
    }
  }
  getorders(uid?: string) {
    if(uid){
      this.InitializeCollectionUid(uid);
      this.orders = this.orderCollection.snapshotChanges().pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Order;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
      return this.orders;
    }
    //Para que el admin pueda verlos todos
    this.orders = this.orderCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Order;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
    return this.orders;
  }

  getorder(id: string) {
    return this.afs.doc<Order>(`orders/${id}`);
  }

  save(order: Order){
    const id = faker.random.alphaNumeric(16);
    order.id = id;
    this.orderCollection.doc(id).set(order);
  }
}
