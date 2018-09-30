import { Component, TemplateRef } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../auth/auth.service';
import { ProductsService } from '../../common/products.service';
import { Product } from '../../models/product';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.css']
})
export class ProductsFormComponent{
modalref: BsModalRef;
text = '';
  constructor(
    private firestore: AngularFirestore,
    public auth: AuthService,
    public data: Product,
    private modalService: BsModalService,
    private productService: ProductsService
  ) { 
  }
  
  saveProduct(template: TemplateRef<any>){
    if(this.data.id){
      this.productService.update(this.data).then(() => {
        alert("producto actualizado")
      }).catch(error => {
        alert(error.message);
      })
    } else {
      this.productService.save(this.data).then(() => {
        alert("Producto creado");
      }).catch(error => {
        alert(error.message);
      })
    }
    this.modalref.hide();
    this.modalref = null;
  }
}
