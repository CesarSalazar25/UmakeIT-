import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject, combineLatest } from 'rxjs';
import { AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  productos;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  createModalRef: BsModalRef;
  createModalRef2: BsModalRef;
  selectedProduct: Product;
  nameValue;
  descriptionValue;
  priceValue;
  newProduct: Product = new Product();
  searchText: string = "";
  uploadProgress: Observable<number>; 
  ref: AngularFireStorageReference;
  downloadURL: Observable<string>;
  imageUrl: string = null;
  oldimageUrl: string = null;
  searchterm: string = "";
  startAt = new Subject();
  endAt = new Subject();
  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();

  constructor(private productService: ProductService, 
    private modalService: BsModalService, 
    private router: Router,
    private storage: AngularFireStorage,
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

  openCreateModal(template: TemplateRef<any>){
    this.newProduct.name = "";
    this.newProduct.description = "";
    this.newProduct.price = 0;
    this.newProduct.extras = [];
    this.createModalRef = this.modalService.show(template, {class: 'modal-lg'})
  }
  openModal(template: TemplateRef<any>, editProduct: Product) {
    console.log(editProduct);
    this.selectedProduct = editProduct;
    this.nameValue=this.selectedProduct.name;
    this.descriptionValue = this.selectedProduct.description;
    this.priceValue = this.selectedProduct.price;
    //this.productService.updateProducto(this.selectedProduct);
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });
    this.modalRef.hide();
  }

  openCreateModal2(template: TemplateRef<any>){
    this.createModalRef2 = this.modalService.show(template, { class: 'second' });
    this.createModalRef.hide();
  }

  closeSecondCreateModal(template: TemplateRef<any>){
    this.createModalRef2.hide();
    this.modalRef2 = null;
    this.createModalRef = this.modalService.show(template, {class: 'modal-lg'})
  }

  closeSecondModal(template: TemplateRef<any>) {
    this.modalRef2.hide();
    this.modalRef2 = null;
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  openModal3(template: TemplateRef<any>, product: Product) {
    this.modalRef3 = this.modalService.show(template);
    this.modalRef3.hide();
    this.selectedProduct = product;
    console.log(this.selectedProduct);
  }

  updateProduct(form: NgForm){
    if(form.value.name != ""){
      this.selectedProduct.name = form.value.name;
    }
    if(form.value.descripcion != ""){
      this.selectedProduct.description = form.value.descripcion;
    }
    if(form.value.precio != undefined){
      this.selectedProduct.price = +form.value.precio;
    }
    if(this.imageUrl!=null)
    {
      this.oldimageUrl=this.selectedProduct.photoUrl;
      this.selectedProduct.photoUrl=this.imageUrl;
      this.deleteImage(this.oldimageUrl);
      this.imageUrl=null;
    }
    this.productService.updateProducto(this.selectedProduct);
    console.log(this.imageUrl);
    this.modalRef.hide();
    this.modalRef = null;
  }

  createProduct(form: NgForm){
    if(form.value.name === ""){
      alert("Debe insertar un nombre");
      return;
    }else if(form.value.descripcion === ""){
      alert("Debe insertar una descripcion");
      return;
    }else if(form.value.precio === ""){
      alert("Debe insertar un precio");
      return;
    }else {
      var productoNuevo = {
        name: form.value.name,
        price: form.value.precio,
        description: form.value.descripcion,
        //Controlar PhotoUrl
        photoUrl: "",
        available: true,
        created_at: new Date(),
        cantidad: 0,
        extras: this.newProduct.extras,
      }
    }
    if(this.imageUrl!=null)
    {

      var productoNuevo = {
        name: form.value.name,
        price: form.value.precio,
        description: form.value.descripcion,
        photoUrl: this.imageUrl,
        available: true,
        created_at: new Date(),
        cantidad: 0,
        extras: this.newProduct.extras,
      }
    }
    this.imageUrl=null;
    this.productService.crearProducto(productoNuevo);
    this.createModalRef.hide();
    this.createModalRef =null;
  }
  //metodo para edit
  addExtra(form: NgForm, template: TemplateRef<any>){
    if(form.value.extraName === ""){
      alert("Debe insertar un Nombre");
      return;
    }else if(form.value.extraPrecio === ""){
      alert("Debe insertar un Precio")
      return;
    } else {
      var extraname = form.value.extraName;
      var extraprice = form.value.extraPrecio
       var extra = { 
        anadido: false,
        name: extraname,
        price: extraprice
      }
      
      if(this.selectedProduct.extras == undefined)
      {
        this.selectedProduct.extras = [];
      }

      this.selectedProduct.extras.push(extra);
      console.log(this.selectedProduct);
      this.closeSecondModal(template)
    }
  }
  //metodo para crear
  addCreateExtra(form: NgForm, template: TemplateRef<any>){
    if(form.value.extraName === ""){
      alert("Debe insertar un Nombre");
      return;
    }else if(form.value.extraPrecio === ""){
      alert("Debe insertar un Precio")
      return;
    } else {
      var extraname = form.value.extraName;
      var extraprice = form.value.extraPrecio

       var extra = { 
        anadido: false,
        name: extraname,
        price: extraprice
      }
      this.newProduct.extras.push(extra);
      this.closeSecondCreateModal(template)
    }
  }
  //Metodo para edit
  removeExtra(extra){
    this.selectedProduct.extras.forEach(extraElement => {
      if(extra.name == extraElement.name){
        var index = this.selectedProduct.extras.indexOf(extraElement);
        this.selectedProduct.extras.splice(index,1);
      }
    });
  }
  //metodo para crear
  removeCreateExtra(extra){
    this.newProduct.extras.forEach(extraElement => {
      if(extra.name == extraElement.name){
        var index = this.selectedProduct.extras.indexOf(extraElement);
        this.selectedProduct.extras.splice(index,1);
      }
    });
  }

  confirm(): void {
    this.modalRef.hide();
  }
 
  decline(): void {

    this.modalRef.hide();
    if(this.imageUrl!=null)
    {
      this.deleteImage(this.imageUrl);
      this.imageUrl=null;
    }
    this.imageUrl=null;
  }
  declineCreate(){
    this.createModalRef.hide();
    if(this.imageUrl!=null)
    {
      this.deleteImage(this.imageUrl);
      this.imageUrl=null;
    }
    this.imageUrl=null;
  }
  getProducts() {
    this.productService.getProductos().subscribe(productos => this.productos = productos);
  }

  removeAvaliable(product: Product){
    this.productService.quitarDisponibilidad(product);
  }
  AddAvaliable(product: Product){
    this.productService.agregarDisponibildiad(product);
  }

  delet()
  {
    this.modalRef3.hide();
    var productoEliminar ={
      id: this.selectedProduct.id,
      name: this.selectedProduct.name,
      price: this.selectedProduct.price,
      description: this.selectedProduct.description,
      photoUrl: this.selectedProduct.photoUrl,
      available: true,
      created_at: new Date(),
      cantidad: 0,
      extras: this.selectedProduct.extras
    }

    this.productService.deleteProducto(productoEliminar);
    this.deleteImage(this.selectedProduct.photoUrl);
    
  }


  upload(event) 
  {
    // Obtiene la imagen:
    const file = event.target.files[0];
    
    // Genera un ID random para la imagen:
    const randomId = Math.random().toString(36).substring(2);
    const filepath = `Imágenes/products/${randomId}`;
    // Cargar imagen:
    const task = this.storage.upload(filepath, file);
    this.ref = this.storage.ref(filepath);
    // Observa los cambios en el % de la barra de progresos:
    this.uploadProgress = task.percentageChanges();
    // Notifica cuando la URL de descarga está disponible:
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();  
        this.downloadURL.subscribe(url => {this.imageUrl = url} );
      })
    ).subscribe();
  }

  deleteImage(urlToDelete: string)
  {
    this.storage.refFromURL(urlToDelete).delete().toPromise().then( () => {
      // Successfully deleted
      }).catch( err => {
        // Handle err
    });
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
    return this.afs.collection('products', ref => ref.orderBy('name')
    .startAt(start).endAt(end)).valueChanges();  
  }
  
}
