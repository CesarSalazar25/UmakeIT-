export class Product {
    id?: string;
    name?: string;
    price?: number;
    description?: string;
    photoUrl?: string;
    available?: boolean;
    created_at: Date = new Date();
}
