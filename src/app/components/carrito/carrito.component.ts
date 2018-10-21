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
  total: number;
  totalIva: number;
  User_id: string;

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
          //this.total = this.CartService
          this.User_id = user.uid;
        })
      }
    })
  }
  prueba(){
    console.log(this.cart);
  }
  getCarrito(User_id: string) {
   this.total = 1111 + 12341 + 100;
   this.totalIva = this.total + (this.total*0.12);
   this.cart = this.CartService.myCart(User_id);
  }
}
