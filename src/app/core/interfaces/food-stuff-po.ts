import { FoodStuffPOItemDTO } from "./food-stuff-po-item";


// Assuming you have the FoodStuffPoDTO interface already defined in TypeScript.
export interface FoodStuffPoDTO {
    foodStuffPoId: number;
    company: string;
    storeCode: number;
    orderNumber:string;
    deliveryAddress1?: string;
    deliveryAddress2?: string;
    deliveryCity?: string;
    deliveryState?: string;
    deliveryPostalCode?: string;
    deliveryCountry?: string;
    billingAddress1?: string;
    billingAddress2?: string;
    billingCity?: string;
    billingPostalCode?: string;
    billingState?: string;
    billingCountry?: string;
    subTotal?: number;
    taxPercentage?: number;
    totalTax?: number;
    grandTotal?: number;
    dueDate?: Date; // or string if you're using ISO date strings
    orderDate?: Date; // or string if you're using ISO date strings
    addedDate?: Date; // or string if you're using ISO date strings
    addedBy?: number;
    xmlData?: string;
    cin7Id?:number;
    salesOrderCode?:string;
    error?:string;
    poItems?: FoodStuffPOItemDTO[]; // List of items
}
