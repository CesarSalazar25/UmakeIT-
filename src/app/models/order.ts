import {Product} from "./product";
export class Order {
    id: string;
    uid: string;
    product: Product[] = [];
    amount: number;
    created_at: string;
    constructor()
    {
        
    }
}
