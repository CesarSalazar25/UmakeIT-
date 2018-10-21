import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  cart: any;
  constructor(public auth: AuthService, public cartService: CartService) 
  {}

  ngOnInit() {
    this.auth.User.subscribe(data => {
      if(data) {
        const cartRef = this.cartService.myCartRef(data.uid).get();
        cartRef.then((cart) => {
          if(cart.exists) {
            this.cartService.myCart(data.uid).subscribe(myCart => {
              this.cart = myCart.payload.data();
            })
          } else {
            this.cartService.createCart(data.uid);
            this.cartService.myCart(data.uid).subscribe(myCart => {
              this.cart = myCart.payload.data();
            })
          }
        })
      }
    })
  }

}
