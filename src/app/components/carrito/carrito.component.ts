import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../auth/auth.service';
import { Cart } from '../../models/cart';
import { Product } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  
  cart: any;
  total: number = 0;
  iva: number = 0;
  totalIva: number =0;
  User_id: string;
  extrasName: string;

  constructor(
    private CartService: CartService,
    public auth: AuthService,
    private router: Router
  ) { 

  }

  ngOnInit() {
    this.auth.User.subscribe(user => {
      if(user){
        this.CartService.myCart(user.uid).subscribe(Cart => {
          this.cart = Cart.payload.data();
          this.User_id = user.uid;
          this.getTotal();
        })
      }
    })
  }
  getTotal(){
    this.total = this.CartService.totalPrice(this.cart.products);
    this.iva = this.total * 0.12;
    this.totalIva = this.total + this.iva;
  }
  prueba(){
    //Boton paypal llama aca
  }

  Eliminar(product, index){
    this.CartService.removeProduct(product, this.cart.id, index);
  }
  
  clearCart(){
    this.CartService.resetCart(this.cart.id);
  }
}
