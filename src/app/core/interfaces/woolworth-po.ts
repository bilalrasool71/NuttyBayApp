import { WoolWorthPoItem } from "./woolworth-po-item";

export interface WoolWorthPO {
    poId: number;
    companyId?: string;
    company?: string;
    streetAddress?: string;
    city?: string;
    zipCode?: string;
    state?: string;
    poNumber?: string;
    orderDate?: Date;
    dueDate?: Date;
    addedDate?: Date;
    subTotal?: number;
    taxPercentage?: number;
    taxAmount?: number;
    taxStatus?: string | null; // To handle nullable types
    grandTotal?: number;
    xmlData?: string;
    cin7Id?:number;
    salesOrderCode?:string;
    error?:string;
    poItems?: WoolWorthPoItem[];
  }