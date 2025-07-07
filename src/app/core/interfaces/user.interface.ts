
export interface IUser {
    userId?:number;
    email?:string;
    password?:string;
    firstName?:string;
    lastName?:string;
    phoneNumber?:string;
    mobileNumber?:string;
    roleId?:number;
    role?:IRole;
    organizationId?:number;
    organization?:IOrganization;
    purpose?: string;
}

export interface ILoginResponse {
    isAuthenticated:boolean;
    token:string;
    user:IUser
}

export interface IRole {
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
}

export interface IOrganization {
    
}