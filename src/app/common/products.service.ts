import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Product } from "../models/product";

type productsCollection = AngularFirestoreCollection<Product[]>;
type productDocument = AngularFirestoreDocument<Product>;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  products(): productsCollection {
    return this.firestore.collection<Product[]>('products');
  }

  product(id: string): productDocument {
    return this.firestore.doc<Product>('products/${id}');
  }
  //Usar faker
  save(product: Product): Promise<any> {
     return this.products().doc(product.id).set(Object.assign({}, product))
  }

  update(product: Product): Promise<any> {
    return this.product(product.id).update(Object.assign({}, product))
  }

  getProductImages(productId: string) {
    return this.firestore.doc<Product>(`products/${productId}`).collection('uploads');
  }
  
}
