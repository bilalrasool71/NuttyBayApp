import { Assesment } from "./assesment";
import { AssesmentQuestionOption } from "./assesment-question-option";
import { AssesmentQuestionPhoto } from "./assesment-question-photo";
import { AssesmentStage } from "./assesment-stage";
import { QuestionType } from "./question-type";

export interface AssessmentQuestion {
    assesmentQuestionId: number;
    assesmentQuestionText: string;
    questionTypeId: number;
    assessmentStageId?: number | null;
    assessmentId: number;
    questionType: QuestionType;
    assessment: Assesment;
    assesmentId?:number;
    answer?:string;
    previousFacings?:string;
    optionId?:number;
    isChecked?:boolean;
    numberAnswer?:number;
    assessmentStage?: AssesmentStage | null;
    questionOptions?:AssesmentQuestionOption[];
    dynamicOptions?:any;
    isShowCompetitors?:boolean|false;
    parentQuestionId?:number;
    childQuestionsForOff?:AssessmentQuestion[];
    childQuestionsForOn?:AssessmentQuestion[];
    assesmentQuestionPhotos?:AssesmentQuestionPhoto[];
    isHideQuestion?:boolean;
    isShowOnNotChecked?:boolean;
    linkContent:string;
    linkURL:string;
    isTargetedProduct?:boolean;
  }
