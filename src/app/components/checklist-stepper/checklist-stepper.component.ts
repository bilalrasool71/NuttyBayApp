import { Component, OnDestroy, OnInit } from '@angular/core';
import { INBChecklist, INBChecklistTasks, IPrePackingData } from '../../core/interfaces/domain.interface';
import { RestService } from '../../services/rest-service/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UtilsModule } from '../../core/utilities/utils.module';
import { ProductionRunDetailResponse, ProductPrePackingInfo, SavePrePackingRequest, TaskInfo } from '../../core/interfaces/production-run-detail.interface';

@Component({
    selector: 'app-checklist-stepper',
    templateUrl: './checklist-stepper.component.html',
    styleUrls: ['./checklist-stepper.component.scss'],
    imports: [UtilsModule]
})
export class ChecklistStepperComponent implements OnInit, OnDestroy {
    productionRunData!: ProductionRunDetailResponse;
    allChecklists: INBChecklist[] = [];
    productionId: number | null = null;
    currentValue: number = 1;
    private destroy$ = new Subject<void>();
    isSaving = false;
    saveInProgress = false;
    userId: number;
    currentChecklistId: number | null = null;
    steps = ['Pre-Making', 'Making', 'Pre-Packing', 'Packing'];


    constructor(
        private restService: RestService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.route.queryParams.subscribe((params) => {
            this.productionId = params['productionId'] ? Number(params['productionId']) : null;
        });
        this.userId = this.authService.getUserData().userId ?? 0;
    }

    ngOnInit(): void {
        this.loadProductionRunData();
        this.loadChecklists();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadProductionRunData(): void {
        this.restService.getProductionRunDetails(Number(this.productionId)).subscribe({
            next: (data) => {
                this.productionRunData = data;
                this.productionRunData.prePackingList?.forEach(item => {
                    if(item.prePackingData.time) {
                        const date = new Date(item.prePackingData.time);
                        item.prePackingData.time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                })
            },
            error: (err) => {
                console.error('Error loading production run data:', err);
            }
        });
    }

    private loadChecklists(): void {
        this.restService.getAllChecklists().subscribe({
            next: (data) => {
                this.allChecklists = data;
            },
            error: (err) => {
                console.error('Error loading production run data:', err);
            }
        });
    }

    onChange(task: TaskInfo, checklistId: number) {
        const productionRunId = this.productionRunData.productionRunId;

        const updates = this.productionRunData.products.map(product => ({
            productionRunId,
            checklistId,
            taskId: task.taskId,
            productId: product.productId,
            isCompleted: task.isCompleted
        }));

        this.restService.updateTaskStatus(updates).subscribe({
            next: () => {
            },
            error: err => {
                console.error(err);
            }
        });
    }

    onSavePrePacking(preObj: ProductPrePackingInfo): void {
        let formattedTime = preObj.prePackingData.time;
    
        // If it's a Date object, convert to ISO string or your preferred format
        if (preObj.prePackingData.time instanceof Date) {
            formattedTime = preObj.prePackingData.time.toISOString();
            // Or use a specific format:
            // formattedTime = this.formatTime(preObj.prePackingData.time);
        }

        
        const payload: SavePrePackingRequest = {
            productionRunId: this.productionRunData.productionRunId,
            productId: preObj.productId,
            temperature: preObj.prePackingData.temperature,
            pH: preObj.prePackingData.ph,
            time:formattedTime,
            isCompleted: true
        };

        this.restService.savePrePackingData(payload).subscribe({
            // next: () => this.messageService.add({ severity: 'success', summary: 'Saved successfully' }),
            // error: () => this.messageService.add({ severity: 'error', summary: 'Save failed' })
        });
    }

    goToExit() {
        this.router.navigate(['/app'])
    }

    validateValue(value: any, type: string) {
        console.log(value)
        if(value) {
            if (type =='temperature') {
                 if (value >= 0 && value <= 100) {
                    value = value;
                 } else {
                    value = 0;
                 }
            } else if (type == 'ph') {
                if (value >= 0 && value <= 14) {
                    value = value;
                } else {
                    value = 0;
                }
            }
        }
    }
}