import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productCollection: AngularFirestoreCollection<Product>;
  productDoc: AngularFirestoreDocument<Product>;
  productos: Observable<Product[]>;
  productosDisponible: Observable<Product[]>;
  producto: Observable<Product>;

  constructor( 
    private afs: AngularFirestore) {
      this.productCollection = this.afs.collection('products', ref => ref);
  }

  crearProducto(product: Product){
    this.productCollection.add(product);
  }

  getProductos():Observable<Product[]>{
    this.productos = this.productCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.productos;
  }
  
  buscarProducto(termino:string)
  {
     let productsArr:Product[]=[];
     termino = termino.toLowerCase();
     //Hacer metodo para suscribirme al observable y luego igualarlo a mi array
    //  for(let i=0; i<this.productosDisponible.length; i++)
    //  {
    //    let heroe = this.productosDisponible[i];
    //    let nombre = heroe.nombre.toLowerCase();
    //    if(nombre.indexOf(termino) >=0)
    //    { 
    //      heroe.idx = i;
    //      productsArr.push(heroe);
    //    }
    //  }
     return productsArr;
  }
  getProductosDisponible():Observable<Product[]>{
    this.productosDisponible = this.productCollection.snapshotChanges().pipe(map(changes=> {
      return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          return data;
      });
    }));
    return this.productosDisponible.pipe(map(arr => arr.filter( r => r.available === true)))
  }
 
  getProducto( idProducto: string){
    this.productDoc = this.afs.doc<Product>(`products/${idProducto}`);
    this.producto = this.productDoc.snapshotChanges().pipe(map(action => {
      if(action.payload.exists == false){
        return null;
      }else{
        const data = action.payload.data() as Product;
        data.id = action.payload.id;
        return data;
      }
    }));
    return this.producto;
  }

  updateProducto(product: Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    this.productDoc.update(product);
  }
  //Not even use
  deleteProducto(product: Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    this.productDoc.delete();
  }
  quitarDisponibilidad(product: Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    product.available = false;
    this.productDoc.update(product);
  }
  agregarDisponibildiad(product: Product){
    this.productDoc = this.afs.doc(`products/${product.id}`);
    product.available = true;
    this.productDoc.update(product);
  }
}
