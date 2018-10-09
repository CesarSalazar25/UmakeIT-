import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { carrito } from '../../models/carrito';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  productosCarrito: carrito[];
  total: number;
  totalIva: number;
  constructor(
    private CarritoService: CarritoService
  ) { }

  ngOnInit() {
    this.getCarrito();
  }

  getCarrito() {
   this.CarritoService.getCarrito().subscribe(productos => this.productosCarrito = productos);
   this.total = 1111 + 12341 + 100;
   this.totalIva = this.total + (this.total*0.12);
  }
}
