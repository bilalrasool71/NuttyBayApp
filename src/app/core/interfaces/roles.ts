export interface Role {
    roleId?: number;
    roleName?: string;
    salesOrders?: boolean;
    reports?: boolean;
    dashboards?: boolean;
    mappings?: boolean;
    accounts?: boolean;
    settings?: boolean;
    salesReports?:boolean;
    assesmentApp?:boolean;
    assesmentAdmin?:boolean;
    sync?:boolean;
    purchaseOrder?:boolean
    gp?:boolean;
    support?:boolean;
    supportAdmin?:boolean;
    proofOfDelivery?:boolean;
    veganShop?:boolean;
    notificationAdmin?:boolean;
    notification?:boolean;
}