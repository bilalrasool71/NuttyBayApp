import { AssesmentStage } from "./assesment-stage";
import { AssesmentType } from "./assesment-type";
import { ContactEntity } from "./contact";
import { Product } from "./product";
import { Question } from "./question";
import { User } from "./user";

export interface Assesment{
    assesmentId?:number;
    storeId?:number;
    assignedBy?:number;
    assignedByUser?:User;
    assignedTo?:number;
    assignedToUser?:User;
    assesmentDate?:Date;
    dueDate?:Date;
    store?:ContactEntity;
    assesmentTypeId?:number;
    assesmentType?:AssesmentType
    storeIds?:string[];
    assesmentStages?:AssesmentStage[];
    isCompleted?:boolean;
    products?:Product[];
    bannerQuestions?:Question[];
    priority?:number;
    supplierFeedBack?:string;
    targetedProductId?:number;
    targetedProductIds?:string[];
    targetedProductIdsStr?:string;

}