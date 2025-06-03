import { WoolWorthPO } from "./woolworth-po";

export interface WoolWorthPoItem {
    itemId: number;
    wwId: string;
    name: string;
    code: string;
    qty: number;
    grossPrice: number;
    grossValue: number;
    uomDetails: number;
    unitOfMeasurement: string;
    unitPrice: number;
    totalAmount: number;
    wwPoId: number;
    woolWorthPO?: WoolWorthPO; // Optional to handle circular references
  }
  