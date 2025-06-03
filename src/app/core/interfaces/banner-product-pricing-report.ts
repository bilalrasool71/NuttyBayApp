import { PurchaseOrderItemsReport } from "./purchaseorder-items-report";

export interface BannerProductPricingReport {
  productOptionId: number;
  styleCode: string;
  code: string;
  name: string;
  stockAvailable: number;
  stockOnHand: number;
  holdingStock: number;
  incomingStock: number;
  pricings: { [key: string]: number }; // Dictionary equivalent in TypeScript
  weekData:WeeKData[];
  purchaseOrderItemsReport:PurchaseOrderItemsReport[];
}

export interface WeeKData {
  weekName: string;
  weekStart: Date;
  weekEnd: Date;
  isStartRedAlert: boolean;
  isMarkRedAlertWeeks: boolean;
  stockOnHand:number;
  incomingStock:number;
  averageForLast16Weeks:number;
}