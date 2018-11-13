import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
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
  modalRef: BsModalRef;
  constructor(
    private ordersService: OrdersService,
    private auth: AuthService, private modalService: BsModalService) {}

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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.hide();
  }

}
