import { Component, OnInit } from '@angular/core';
import { PersonalizeService } from '../../services/personalize.service';
import { Product } from '../../models/product'
import { AuthService } from '../../auth/auth.service';
import { Router} from "@angular/router";
import { CartService } from 'src/app/services/cart.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-personalizar',
  templateUrl: './personalizar.component.html',
  styleUrls: ['./personalizar.component.css']
})
export class PersonalizarComponent implements OnInit {
  
  products: Product[];
  prices: number[] = [];
  Total: number = 0;

  constructor(
    public personalizeService: PersonalizeService,
    public auth: AuthService,
    public router: Router,
    public cartService: CartService,
  ) { 
  }

  ngOnInit() {
    this.getProducts();
    
    for (let i = 0; i < this.products.length; i++) {
      this.prices[i] = this.products[i].price;  
      this.Total += this.prices[i];
    }
  }

  getProducts() {
   this.products = this.personalizeService.getProducts();
  }
  //Si funciona padre/hijo ELIMINAR ESTA COCHINADA DE MIERDA 
  checkboxChanged(productIndex: number, extraIndex: number){
    console.log(this.prices);
    console.log(this.products);
    if(!this.products[productIndex].extras[extraIndex].anadido){
      this.products[productIndex].extras[extraIndex].anadido = !this.products[productIndex].extras[extraIndex].anadido
      console.log(this.products);
      var price = +this.products[productIndex].extras[extraIndex].price;
      this.prices[productIndex] += price;
      this.Total += price;
    }else{
      this.products[productIndex].extras[extraIndex].anadido = !this.products[productIndex].extras[extraIndex].anadido
      var price = -this.products[productIndex].extras[extraIndex].price;
      this.prices[productIndex] += price;
      this.Total += price;
    }
  }



  ExtraChange(agregado: boolean, productIndex: number, extraIndex: number){
    if(agregado){
      this.products[productIndex].extras[extraIndex].anadido = agregado;
      var price = +this.products[productIndex].extras[extraIndex].price;
      this.prices[productIndex] += price;
      this.Total += price;
    }else {
      this.products[productIndex].extras[extraIndex].anadido = agregado;
      var price = -this.products[productIndex].extras[extraIndex].price;
      this.prices[productIndex] += price;
      this.Total += price;
    }
    console.log(this.products);
  }

  anadirCarrito(){
    //Limpar los productos del servicio intermediario
    this.personalizeService.clearProducts();
    //Obtener la cantidad de productos totales
    let cantidad = this.personalizeService.cantidad;
    //llenar el carrito con el array de productos
    //Cantidad -> cantidad total de productos
    this.cartService.addProduct(this.products, cantidad);
    this.router.navigate(['dashboard/shop']);    
  }
}
