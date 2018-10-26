import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Cart } from "../models/cart";
import { Product } from "../models/product";
import { reject } from 'q';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  carritoProducts: Product[] = [];
  constructor(
    public auth: AuthService,
    private afs: AngularFirestore
  ) { }

  createCart(id){
    this.afs.collection('carts').doc(id).set(
      {id: id, products: [], totalProducts: 0}
    )
  }

  myCart(uid){
    return this.afs.doc<Cart>(`carts/${uid}`).snapshotChanges();
  }

  myCartRef(uid){
    return this.afs.collection<Cart>('carts').doc(uid).ref;
  }

  addProduct(product: Product[], cantidad: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.User.subscribe(data => {
        if(data){
          const cartRef = this.myCartRef(data.uid);
          cartRef.get().then(doc => {
            let cartData = doc.data();
            let productsInCart = cartData.products;
            for (let i = 0; i < cantidad; i++) {
              if(!isUndefined(product[i].extras)){
                const productToCart = {
                  id: product[i].id,
                  name: product[i].name,
                  price: product[i].price,
                  extras: product[i].extras,
                  qty: 1
                }
                productsInCart.push(productToCart);
                }else{
                  const productToCart = {
                    id: product[i].id,
                    name: product[i].name,
                    price: product[i].price,
                    qty: 1
                  }
                  productsInCart.push(productToCart);
                }
              }
            cartData.totalProducts += cantidad;
          return cartRef.update(cartData).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
          })
        }
      })
    })
  }

  static totalProducts(product: Product[]) {
    let sum = 0;
    for (let i = 0; i < product.length; i++) {
      sum += parseInt(product[i]['qty'])
    }
    return sum;
  }
}