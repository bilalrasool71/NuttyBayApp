export interface PriceTier{
    priceTierId?:number;
    priceTierName?:string;
    priceTierCustomName: string;
}


// DTO for price updates
export interface PriceUpdateDto {
  productId: number;
  priceTierId: number;
  newPrice: number;
}

// DTO for update response
export interface UpdateResultDto {
  success: boolean;
  message?: string;
  updatedCount?: number;
  failedUpdates?: FailedUpdateDto[];
}

export interface FailedUpdateDto {
  productId: number;
  error: string;
}
