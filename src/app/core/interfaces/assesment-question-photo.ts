export interface AssesmentQuestionPhoto {
    assesmentQuestionPhotosId?: number;
    assesmentQuestionId?: number;
    base64?: string;
    contentType?: string;
    fileUrl?: string;
    fileName?: string;
    label?:string;
    size?: number;
    addedDate?: Date;
    addedBy?: number;
}