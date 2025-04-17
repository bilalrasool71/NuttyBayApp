import { IChecklist } from "./checklist.interface";

export interface IProductionRun {
    id: number;
    name: string;
}

export interface IProductionRunChecklist extends IProductionRun {
    checklist: IChecklist[];
}