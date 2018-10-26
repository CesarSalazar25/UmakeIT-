import { Extras } from "./extras";

export class Product {
    id?: string;
    name?: string;
    price?: number;
    description?: string;
    photoUrl?: string;
    available?: boolean;
    created_at: Date = new Date();
    cantidad?: number;
    extras?: Extras[];
    // constructor(id, name, price, description, photoUrl, available, cantidad, extras){
    //     this.id = id;
    //     this.name = name;
    //     this.price = price;
    //     this.description = description;
    //     this.photoUrl = photoUrl;
    //     this.available = available;
    //     this.cantidad = cantidad;
    //     this.extras = extras;
    //     this.created_at= new Date();
    // }
    constructor(){
        
    }
}
