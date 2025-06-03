import { AssessmentQuestion } from "./assesment-question";
import { AssesmentType } from "./assesment-type";

export interface AssesmentStage{
    stageId?:number;
    stageName?:string;
    stageDescriptions?:string;
    stageNumber?:number;
    isActive?:boolean;
    assesmentTypeId?:number;
    assesmentType?:AssesmentType;
    assesmentQuestions?:AssessmentQuestion[]
}