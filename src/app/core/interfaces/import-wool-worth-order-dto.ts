import { SalesOrder } from "./sales-order";
import { WoolWorthPO } from "./woolworth-po";

export interface ImportWoolworthOrderDTO {
    angelFoodSalesOrder?: SalesOrder;
    woolWorthPO?: WoolWorthPO;
    cin7FoodSalesOrder?: SalesOrder;
}
