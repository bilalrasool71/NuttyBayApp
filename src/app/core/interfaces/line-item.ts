export interface LineItem {
    createdDate?: Date | null;
    productOptionId?: number;
    integrationRef?: string;
    sort?: number;
    code?: string;
    name?: string;
    option1?: string;
    option2?: string;
    option3?: string;
    qty?: number | null;
    styleCode?: string;
    barcode?: string;
    lineComments?: string;
    unitCost?: number;
    unitPrice?: number | null;
    uomPrice?: number | null;
    discount?: number;
    uomQtyOrdered?: number | null;
    accountCode?: string;
    stockControl?: string;
    total?:number;
    uniqueId?:number;
    qtyInCarton?:number;
    stockAvailable?:number;
}
