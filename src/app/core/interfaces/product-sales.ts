export interface ProductSales {
    id: number;
    createdDate:Date;
    name: string;
    code: string;
    company: string;
    contactId: number;
    bannerId: number;
    bannerName: string;
    bannerCategoryId: number;
    bannerCategoryName: string;
    codeValue: string;
    value: number;
    cost: number;
    qty: number;
    gp: number;
    totalStores: number;
    salesOrderId:number;
    invoiceNumber:string;
    customerOrderNo:string;
    reference:string
}