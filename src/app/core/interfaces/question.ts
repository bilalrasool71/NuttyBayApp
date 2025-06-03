import { QuestionType } from "./question-type";

export interface Question {
    assesmentQuestionId?: number;
    assesmentQuestionText?: string;
    questionTypeId?: number;
    assesmentStageId?: number;
    parentQuestionId?: number;
    productId?: number;
    isMainProductQuestion?: boolean;
    isIndenpendentProductQuestion?: boolean;
    bannerId?: number;
    questionType?: QuestionType;
    isInActive?:boolean;
}
