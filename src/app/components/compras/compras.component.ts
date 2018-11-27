import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { OrdersService } from 'src/app/services/orders.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subject, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

declare let paypal: any;

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  isCollapsed = true;
  orders: any
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  searchterm: string = "";
  startAt = new Subject();
  endAt = new Subject();
  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();
  addScript: boolean = false;
  selectedOrder: any;
  paypalLoad: boolean = true;
  constructor(
    private ordersService: OrdersService,
    private auth: AuthService, 
    private modalService: BsModalService,
    private afs: AngularFirestore,
    private orderService: OrdersService,) {}

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
  openRecompra(template: TemplateRef<any>, orden:any){
    this.modalRef2 = this.modalService.show(template);
    this.selectedOrder = orden;
    console.log(this.selectedOrder);
    this.RenderPaypal();
  }
// Variable paypalConfig
paypalConfig = {
  env: 'sandbox',

  style: {
    label: 'paypal',
    size:  'medium',    // small | medium | large | responsive
    shape: 'rect',     // pill | rect
    color: 'gold',     // gold | blue | silver | black
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
                      amount: { total: this.selectedOrder.amount , currency: 'USD' }
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
          this.PruebaToOrder();
      })
  }
};

RenderPaypal(): void {
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

PruebaToOrder(){
  this.orderService.save(this.selectedOrder);
  }
  decline(){
    this.selectedOrder = null;
    this.modalRef2.hide();
  }
}
