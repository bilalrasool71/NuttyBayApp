import { Banner } from "./banner";
import { ClusterSize } from "./clusterSize";
import { CLuster } from "./cluster";
import { AuditFrequency } from "./audit-frequency";
import { Island } from "./Island";
import { SalesTeam } from "./sales-team";

export interface ContactEntity {
    contactId?: number;
    id?: number;
    createdDate?: Date;
    modifiedDate?: Date;
    isActive?: boolean;
    company?: string;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    email?: string;
    website?: string;
    phone?: string;
    fax?: string;
    mobile?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postCode?: string;
    country?: string;
    postalAddress1?: string;
    postalAddress2?: string;
    postalCity?: string;
    postalPostCode?: string;
    postalState?: string;
    postalCountry?: string;
    notes?: string;
    integrationRef?: string;
    type?: string;
    salesPersonId?: number;
    accountNumber?: string;
    billingId?: number;
    billingCompany?: string;
    accountsFirstName?: string;
    accountsLastName?: string;
    billingEmail?: string;
    accountsPhone?: string;
    billingCostCenter?: string;
    costCenter?: string;
    priceColumn?: string;
    percentageOff?: string;
    paymentTerms?: string;
    taxStatus?: string;
    taxNumber?: string;
    creditLimit?: number;
    balanceOwing?: number;
    onHold?: string;
    group?: string;
    subGroup?: string;
    stages?: string;
    addedDate?: Date;
    accountingId?: number;
    bannerId?:number;
    clusterId?:number;
    clusterSizeId?:number;
    banner?:Banner;
    cluster?:CLuster;
    clusterSize?:ClusterSize;
    auditFrequencyId?:number;
    auditFrequency?:AuditFrequency;
    packingSlip?:string;
    productCategory?:string;
    salesTeamId?:number;
    islandId?:number;
    island?:Island;
    salesTeam?:SalesTeam;
    replyEmail?:string;
    accountNumberPrefix?:string;
    nextAccountNumber?:string;
    guidId?:string;
    minOrderQty?:number;
    independentBannerId?:number;
    supplierCode?:string,
    invoiceEmail?:string,
    invoiceCCEmail?:string,
    invoiceAttention?:string,
    isAssigned?:boolean
}