export interface ProductionRunDetailResponse {
    productionRunId: number;
    productionDate: string;
    products: ProductBasicInfo[];
    sharedChecklists: ChecklistInfo[];
    nbProducts:NBProduct[];
    preMakingDate: Date; 
    makingDate: Date; 
    prePackingDate: Date; 
    postPackingDate: Date;
    prePackingList: ProductPrePackingInfo[];
}

export interface ProductBasicInfo {
    productId: number;
    productName: string;
    unit :number;
    validBatch: string;
    validMonths: number;
    batchNo: string;
    batchNoDate: string;
    numberOfBoxes: number;
}
export interface NBProduct {
    productId: number;
    productName: string;
    unit :number;
    batchNo: string;
}
export interface ChecklistInfo {
    checklistId: number;
    checklistName: string;
    checklistType: number;
    tasks: TaskInfo[];
}

export interface ProductPrePackingInfo {
    productId: number;
    productName: string;
    batchNo: string;
    batchNoDate: string | null;
    validBatch: string | null;
    prePackingData: PrePackingInfo;
}

export interface PrePackingInfo {
    temperature: number | null;
    ph: number | null;
    time: Date | any;
    isCompleted: boolean;
    completedAt: string | null;
    isPhCalibrated: boolean;
    detailId: number;
}
export interface TaskInfo {
    taskId: number;
    taskDescription: string;
    isCompleted: boolean;
    completedAt: string | null;
}

export interface NBProductionRunTaskUpdateDto {
    productionRunId: number;
    checklistId: number;
    taskId: number;
    productId?: number;
    isCompleted: boolean;
}
export interface SavePrePackingRequest {
    productionRunId: number;
    productId: number;
    detailId: number;
    temperature: number | null;
    ph: number | null;
    time: Date | string | null;
    isPhCalibrated: boolean;
}

export interface UserProductionRunSummaryResponse {
    inProgress: ProductionRunSummary[];
    completed: ProductionRunSummary[];
    forDeletion: ProductionRunSummary[];
}

export interface ProductionRunSummary {
    productionRunId: number;
    productionDate: string;
    isPreMakingCompleted: boolean;
    isMakingCompleted: boolean;
    isPrePackingCompleted: boolean;
    isPackingCompleted: boolean;
    isPostPackingCompleted: boolean;
    products: ProductStatus[];
}

export interface ProductStatus {
    productId: number;
    productName: string;
    unit: number;
    batchNo: string;
    batchNoDate: string;
    validMonths: number;
    validBatch: string;
    numberOfBoxes: number;
    prePacking: PrePackingDetail;
}

export interface PrePackingDetail {
    temperature: number | null;
    ph: number | null;
    time: string | null;
    isCompleted: boolean;
    completedAt: string | null;
    batchNo: string | null;
}
export interface NBProductionRunPdf {
    productionRunPdfId: number;
    productionRunId: number;
    fileName: string;
    fileUrl: string;
    contentType: string;
    size: number;
    addedDate: string;
}

export interface NBProductionRunPdf {
    productionRunPdfId: number;
    productionRunId: number;
    fileName: string;
    fileUrl: string;
    contentType: string;
    size: number;
    addedDate: string;
}

export interface UpdateBoxCountRequest {
    productionRunId: number;
    productId: number;
    numberOfBoxes: number;
}


export interface UpdateChecklistDateRequest {
    productionRunId: number;
    checklistId: number;
    date: Date | string | null;
}