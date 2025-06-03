import { ContactEntity } from "./contact";
import { Product } from "./product";

export interface ProductContact {
    productContactId?: number;
    productId?: number;
    contactId?: number;
    code?: string;
    product?: Product;
    contact?: ContactEntity;
    value?:number;
    rate?:number;
    qty?:number;
    gp?:number;
}