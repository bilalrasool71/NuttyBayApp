// domain.interface.ts
export interface INBProduct {
    productId: number;
    productName: string;
    batchNo: string;
  }
  
  export interface INBChecklist {
    checklistId: number;
    checklistName: string;
    checklistOrder: number;
    checklistType: number; // 1=PreMaking, 2=Making, 3=PrePacking, 4=Packing
    isCompleted?:boolean;
  }
  
  export interface INBChecklistTasks {
    taskId: number;
    checklistId: number;
    taskDescription: string;
    isCompleted?: boolean;
    phValue?: number;
    timeValue?: Date;
    temperatureValue?: number;
  }
  
  export interface IProductionRunRequest {
    userId: number;
    productIds: number[];
    productionDate: Date | string;
  }
  
  export interface IProductionRun {
    productionRunId: number;
    userId: number;
    productId: number;
    startTime: Date;
    endTime?: Date;
    status: string;
  }
  
  export interface UpdateTaskStatusRequest {
    isCompleted: boolean;
    ph?: number;
    time?: string;
    temperature?: number;
  }
  
  export interface IPrePackingData {
    temperature: number | null;
    ph: number | null ;
    time: Date | null;
  }