import { SalesOrderItemReport } from "./sale-order-item-report";

export interface BranchOrderItemReport{
    branch:string;
    stage:string;
    createdDate:Date;
    totalSalesOrders:number;
    items:SalesOrderItemReport[];
    
}