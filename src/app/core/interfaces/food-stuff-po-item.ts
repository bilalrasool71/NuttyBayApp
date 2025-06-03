import { FoodStuffPoDTO } from "./food-stuff-po";

export interface FoodStuffPOItemDTO {
    itemId: number;
    foodStuffProductId: string;
    name: string;
    code: string;
    qty: number; // Use number for integer and floating point values
    grossPrice: number;
    uomDetails: number; // Assuming UOMDetails is numeric
    unitOfMeasurement: string;
    unitPrice: number;
    totalAmount: number;
    foodStuffPoId: number;
    foodStuffPO: FoodStuffPoDTO; // Reference to the FoodStuffPoDTO interface
}