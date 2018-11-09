import { Component, OnInit, AfterViewChecked} from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../auth/auth.service';
import { Cart } from '../../models/cart';
import { Product } from '../../models/product';
import { Router } from '@angular/router';

declare let paypal: any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, AfterViewChecked {
  
  cart: any;
  total: number = 0;
  iva: number = 0;
  totalIva: number =0;
  User_id: string;
  extrasName: string;
  paypalLoad: boolean = true;
  addScript: boolean = false;

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

// Variable paypalConfig
  paypalConfig = {
    env: 'sandbox',

    style: {
      label: 'paypal',
      size:  'medium',    // small | medium | large | responsive
      shape: 'rect',     // pill | rect
      color: 'blue',     // gold | blue | silver | black
      tagline: false      
  },
    client: {
        sandbox: 'AZC2Qq_ii09SCT7iRUTjEBrF4a8vx2nUi1ByXmLNT_A-iSsqOTQoyeX8AItdNDaDWiGhrsbwwlbx6nL1',
        production: '<production-key>'
    },
    commit: true,
    payment: (data, actions) => {
        return actions.payment.create({
            payment: {
                transactions: [
                    {
                        amount: { total: this.totalIva , currency: 'USD' }
                    }
                ]
            }
        })
    },
  
    // onAuthorize() is called when the buyer approves the payment
    onAuthorize:(data, actions) => {
  
        // Make a call to the REST api to execute the payment
        return actions.payment.execute().then((payment) => {
            window.alert('Payment Complete!');
        })
    }
  };
  
  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if(!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = true;
      })
    }
  }

  addPaypalScript(){
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js'
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    })
  }
}
  
