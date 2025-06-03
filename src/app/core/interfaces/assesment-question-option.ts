import { AssessmentQuestion } from "./assesment-question";

export interface AssesmentQuestionOption{
    questionOptionId:number;
    questionOptionText:string;
    assesmentQuestionId:number;
    value:string;
    question:AssessmentQuestion;
    isChecked:boolean;
}