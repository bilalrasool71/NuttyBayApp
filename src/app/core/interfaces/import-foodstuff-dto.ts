import { FoodStuffPoDTO } from "./food-stuff-po";
import { SalesOrder } from "./sales-order";

export interface ImportFoodStuffOrder {
    angelFoodSalesOrder?: SalesOrder; // Optional property
    foodStuffPoDTO?: FoodStuffPoDTO; // Optional property
    cin7FoodSalesOrder?: SalesOrder; // Optional property
}
