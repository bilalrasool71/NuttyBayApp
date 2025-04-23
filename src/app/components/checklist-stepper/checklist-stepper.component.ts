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
                if (this.productionRunData.prePackingList.length > 0) {
                    this.productionRunData.prePackingList.forEach(x => {
                        x.prePackingData.time = new Date(x.prePackingData.time)
                    })
                }
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
        const payload: SavePrePackingRequest = {
            productionRunId: this.productionRunData.productionRunId,
            productId: preObj.productId,
            temperature: preObj.prePackingData.temperature,
            pH: preObj.prePackingData.ph,
            time: this.formatLocalTime(new Date(preObj.prePackingData.time)),
            isCompleted: true
        };

        this.restService.savePrePackingData(payload).subscribe({
            next: () => console.log('Saved Successfully'),
            error: () => console.error('Save Failed')
        });
    }

    goToExit() {
        this.router.navigate(['/app'])
    }

    ngStepChange(event: any) {
        this.currentValue = event;
    }


    validateTemperature(prePackingData: any, event: any) {
        let rawValue = parseFloat(event.value);
        if (isNaN(rawValue) || rawValue < 0 || rawValue > 99) {
          rawValue = 0; 
        }
        prePackingData.temperature = rawValue;
        event.value = rawValue;
      }
      
    validatePH(prePackingData: any, event: any) {
        let rawValue = parseFloat(event.value);
        if (isNaN(rawValue) || rawValue < 0 || rawValue > 14) {
            rawValue = 0;
        }
        const rounded = Math.round(rawValue * 10) / 10;
        prePackingData.ph = rounded;
        event.value = rounded;
    }

    formatLocalTime = (date: Date): string => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
}