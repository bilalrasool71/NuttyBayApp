import { User } from "./user";

export interface EmailTemplate {
    emailTemplateId?: number;
    emailTemplateName?: number;
    emailTo?: string;
    emailCc?: string;
    emailBCc?: string;
    subject?: string;
    body?: string;
    category?: string;
    addedBy?: number;
    addedDateTime?: Date;
    lastUpdatedBy?: number;
    lastUpdatedDate?: Date;
    addedByUser?: User;
    lastUpdateByUser?: User;
    emailTypeId?:number;
}