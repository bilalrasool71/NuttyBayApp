export interface EmailLog{
    emailLogId:number;
    emailTypeId:number;
    emailTo:string;
    emailCC:string;
    emailBCC:string;
    subject:string;
    body:string;
    addedDate:Date;
    addedDateLocal:Date;
    sentBy:number;
    isAcknowledged:boolean;
    moduleId:number;
    recordId:number;
    isFromBot:boolean;
    errorLog:string;
    acknowledgementDate:Date;
}