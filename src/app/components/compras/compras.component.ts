import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { OrdersService } from 'src/app/services/orders.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subject, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  isCollapsed = true;
  orders: any
  modalRef: BsModalRef;
  searchterm: string = "";
  startAt = new Subject();
  endAt = new Subject();
  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();

  constructor(
    private ordersService: OrdersService,
    private auth: AuthService, 
    private modalService: BsModalService,
    private afs: AngularFirestore) {}

  ngOnInit() {
    this.getOrders();
}
getOrders() {
  this.auth.User.subscribe(user => {
    if(user){
      this.ordersService.getorders(user.uid).subscribe(orders => this.orders = orders);
      combineLatest(this.startObs, this.endObs).subscribe((value) => {
        this.firequery(value[0], value[1], user.uid).subscribe((ordenes) => {
          this.orders = ordenes;
        })
      })
    }
  })
}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.modalRef.hide();
  }
  search(event){
    const q = event;
    if(q!==null){
      this.startAt.next(q);
      this.endAt.next(q + '\uf8ff');
    }else{
      this.getOrders();
    }
  }
  firequery(start,end, uid){
    return this.afs.collection('orders', ref => ref.orderBy('created_at').where("uid", "==", uid).where("created_at", ">=", start)).valueChanges();  
  }
}
