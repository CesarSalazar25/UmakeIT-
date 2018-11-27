import { Component, OnInit, TemplateRef , ViewChild} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CarouselComponent } from 'ngx-bootstrap';
import { Extras } from '../../models/extras';
import { Router} from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../services/cart.service';
import { PersonalizeService } from '../../services/personalize.service';
import { Subject, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  isCollapsed = true;
  productos;
  selectedProducto: Product;
  quantity: number;
  modalRef: BsModalRef;
  cantidad: number;
  carritoProducts: Product[] = [];
  carritoExtras: Extras[][] = [];
  ExtraTest: Extras[];
  PrecioTotal: number; 
  searchterm: string = "";
  startAt = new Subject();
  endAt = new Subject();
  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();

@ViewChild('carousel') carousel: CarouselComponent;

  constructor(
    private productService: ProductService,
    private modalService: BsModalService,
    public router: Router,
    public auth: AuthService,
    public cartService: CartService,
    public personalizeService: PersonalizeService,
    public afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.getProducts();
    combineLatest(this.startObs, this.endObs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((comidas) => {
        this.productos = comidas;
      })
    })
  }

  getProducts() {
    this.productService.getProductosDisponible().subscribe(productos => this.productos = productos);
  }

  //En caso de modal usar esto (por si decido volver al modal luego)
  //Para modal usar FormArray
  DescriptionModal(i: number, quantity: HTMLInputElement, template: TemplateRef<any>){
    //Verificar si el valor es entero.

    //Verifico si existe un valor
    if(quantity.value === ""){
      alert("Ingrese una cantidad");
    } else if(Number(quantity.value) == 0) {
      alert("La cantidad 0 no es aceptada");
      }else {
      //Capturo mi el valor del input para saber cuantos slides tendra mi Carousel
      this.cantidad = Number(quantity.value);
      this.selectedProducto = this.productos[i];
      this.PrecioTotal = this.selectedProducto.price * this.cantidad;
      //Lleno mi items de Productos para el carrito, para poder controlar la data exacta
      for (let i = 0; i < this.cantidad; i++) {
        this.carritoProducts.push(this.selectedProducto);
      }
      for (let i = 0; i < this.carritoProducts.length; i++) {
        this.carritoExtras[i] = this.carritoProducts[i].extras;
        //Pa ve si frao pero creo q no frao
        this.ExtraTest = this.carritoProducts[i].extras;
      }
      this.modalRef = this.modalService.show(template);

    }
  }

  incrementar(index: number){
    this.productos[index].cantidad = this.productos[index].cantidad + 1;
  }

  decrementar(index: number, quantity: HTMLInputElement){

    if(this.productos[index].cantidad == 0){
      alert("No se puede poner valores negativos");
    } else {
      this.productos[index].cantidad = this.productos[index].cantidad - 1;
    }
  }
  CreateArray(): any[]{
    return Array(this.cantidad);
  }

  GotoPersonalizarCompra(i: number, quantity: HTMLInputElement, user_id: string){
    if(quantity.value === ""){
      alert("Ingrese una cantidad");
    } else if(Number(quantity.value) == 0) {
      alert("La cantidad 0 no es aceptada");
      }else {
      //Cantidad de productos
      this.cantidad = Number(quantity.value);
      //Controlo el producto seleccionado
      this.selectedProducto = this.productos[i];
      //Lleno mi items de Productos para el carrito
      for (let i = 0; i < this.cantidad; i++) {
        this.carritoProducts.push(this.selectedProducto);
      }
    }
    this.personalizeService.updateProducts(this.carritoProducts, this.cantidad);;
    this.router.navigate(['dashboard/personalize']);
  }

  search(event){
    const q = event;
    if(q!==null){
      this.startAt.next(q);
      this.endAt.next(q + '\uf8ff');
    }else{
      this.getProducts();
    }
  }
  firequery(start,end){
    return this.afs.collection('products', ref => ref.orderBy('name').where("available", "==", true).startAt(start).endAt(end)).valueChanges();  
  }
}
