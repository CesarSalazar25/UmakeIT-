import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  orders: Order[];
  constructor(
    private ordersService: OrdersService,
    private auth: AuthService) {}

  ngOnInit() {
    this.getOrders();
}
getOrders() {
  this.auth.User.subscribe(user => {
    if(user.role == 'customer'){
      this.ordersService.getorders(user.uid).subscribe(orders => this.orders = orders);
    }else{
      this.ordersService.getorders().subscribe(orders => this.orders = orders);
    }
  })
}
  applyFilter(filterValue: string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
  }

  trackById(index, order: Order){
    return order.id;
  }
  prueba(){
    console.log(this.orders);
  }
}
