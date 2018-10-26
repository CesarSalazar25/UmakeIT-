import { Injectable } from '@angular/core';
import { Product } from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class PersonalizeService {
  
  personalizedProducts: Product[] = [];
  cantidad: number;
  constructor() { }
  
  getProducts(){
    return this.personalizedProducts;
  }
  updateProducts(products: Product[], quantity: number){
    products.forEach(element => {
      this.personalizedProducts.push(element);
    });
    this.cantidad = quantity;
  }
  
  clearProducts(){
    this.personalizedProducts = [];
  }
 
}
