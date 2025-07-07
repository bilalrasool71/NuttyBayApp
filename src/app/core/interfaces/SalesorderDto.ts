export interface SalesOrderWithHeaderAndItemsDto {
    header: SalesOrderHeaderDto;
    lineItems: SalesOrderLineItemDto[];
}
export interface SalesOrderHeaderDto {
    salesOrderId: number;
    company: string;
    phone: string;
    taxNumber: string;
    accountNo: string;
    billingAddress1: string;
    postCode: string;
    deliveryAddress1: string;
    deliveryPostCode: string;
    taxRate: number;
    productTotal: number;
    grandTotal: number;
    orderDate: string;
    expectedDeliveryDate: string;
    customerOrderNo: string;
    status: string;
    orderMode: string;
}
export interface SalesOrderLineItemDto {
    orderItemId: number;
    productCode: string;
    productId: number;
    productName: string;
    variant1: string;
    variant2: string;
    unitOfMeasure: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    extendedPrice: number;
    lineComments: string;
    batchNo: string;
    uomPrice: number;
    uomQtyOrdered: number;
    unit: number;
    orderMode: string;
    availableBatches: ProductBatchDTO[];
}

export interface ProductBatchDTO {
    batchNo: string;
    availableQuantity: number;
    firstProductionDate: string;
}

export interface DispatchUpdateRequest {
  dispatchDate: Date;
  productTotal: number;
  grandTotal: number;
  lineItems: {
    orderItemId: number;
    productId: number;
    batchNo: string;
    quantity: number;
    uomQtyOrdered: number;
    unitPrice: number;
    unit: number;
  }[];
}