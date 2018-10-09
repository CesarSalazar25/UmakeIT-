import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  productos: Product[];
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProductos().subscribe(productos => this.productos = productos);
  }
}
