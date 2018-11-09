import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Cart } from "../models/cart";
import { Product } from "../models/product";
import { reject } from 'q';
import { isUndefined, isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
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

  addProduct(products: Product[], cantidad: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.User.subscribe(data => {
        if(data){
          const cartRef = this.myCartRef(data.uid);
          cartRef.get().then(doc => {
            let cartData = doc.data();
            let productsInCart = cartData.products;
            for (let i = 0; i < products.length; i++) {
              if(!isUndefined(products[i].extras)){
                const productToCart = {
                  id: products[i].id,
                  name: products[i].name,
                  price: products[i].price,
                  extras: products[i].extras,
                  qty: 1
                }
                const exist = CartService.findEqualProducts(productsInCart, productToCart);
                if(!exist){
                  productsInCart.push(productToCart);
                  cartData.totalProducts += 1;
                }else {
                  exist.qty +=1;
                  cartData.totalProducts +=1;
                }

                }else{
                  const productToCart = {
                    id: products[i].id,
                    name: products[i].name,
                    price: products[i].price,
                    qty: 1
                  }
                  const exist = CartService.findEqualProducts(productsInCart, products[i]);
                  if(!exist){
                    productsInCart.push(productToCart);
                    cartData.totalProducts += 1;
                  }else {
                    exist.qty +=1;
                    cartData.totalProducts +=1;
                  }
                }
              }
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

  static findEqualProducts(productsInCart, product){
    if(!isNullOrUndefined(productsInCart)){
      for (let i = 0; i < productsInCart.length; i++) {
        if(productsInCart[i].id == product.id){
          if(productsInCart[i].extras.length == product.extras.length){
            //Cantidad de extras en el producto
            let qty = productsInCart[i].extras.length;
            let match = 0;
            for (let j = 0; j < productsInCart[i].extras.length; j++) {
              for (let k = 0; k < product.extras.length; k++) {
                if(productsInCart[i].extras[j].name == product.extras[k].name){
                  if(productsInCart[i].extras[j].anadido == product.extras[k].anadido){
                    match += 1;
                  }
                } 
              }
            }
            if(qty == match){
              return productsInCart[i];
            }
          }
        }
      }
    }
    return null;
  }
  static totalProducts(product: Product[]) {
    let sum = 0;
    for (let i = 0; i < product.length; i++) {
      sum += parseInt(product[i]['qty'])
    }
    return sum;
  }

  resetCart(uid): Promise<any>{
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        cartData.products = [];
        cartData.totalProducts = 0;
        return ref.update(cartData).then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }

  totalPrice(products: Product[]): number {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += (parseInt(products[i]['qty']) * products[i]['price']);
    }
    return total;
  }

  removeProduct(product, uid, index): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        let productsInCart = cartData.products;
        let totalQty = cartData.totalProducts;
        cartData.totalProducts = parseInt(totalQty) - parseInt(product.qty);

        cartData.products = [
          ...productsInCart.slice(0, index),
          ...productsInCart.slice(index + 1)
        ];
        return ref.update(cartData).then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }
}