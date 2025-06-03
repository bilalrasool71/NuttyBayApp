import { OrderTrackingStageDTO } from "./order-tracking-stage-dto";

export interface TrackOrderReport {
    date: string;
    totalOrders: number;
    totalOrderMatched: number;
    orderTrackingStageDTOs: OrderTrackingStageDTO[];
  }