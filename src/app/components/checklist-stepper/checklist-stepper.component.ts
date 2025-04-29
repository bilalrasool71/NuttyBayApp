import { Component, OnDestroy, OnInit } from '@angular/core';
import { INBChecklist, INBChecklistTasks, INBProduct, IPrePackingData } from '../../core/interfaces/domain.interface';
import { RestService } from '../../services/rest-service/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilsModule } from '../../core/utilities/utils.module';
import { ProductBasicInfo, ProductionRunDetailResponse, ProductPrePackingInfo, ProductStatus, SavePrePackingRequest, TaskInfo, UpdateBoxCountRequest, UpdateChecklistDateRequest } from '../../core/interfaces/production-run-detail.interface';

@Component({
    selector: 'app-checklist-stepper',
    templateUrl: './checklist-stepper.component.html',
    styleUrls: ['./checklist-stepper.component.scss'],
    imports: [UtilsModule]
})
export class ChecklistStepperComponent implements OnInit, OnDestroy {
    currentStep: number | null = null;
    productionRunData!: ProductionRunDetailResponse;
    allChecklists: INBChecklist[] = [];
    productionId: number | null = null;
    private destroy$ = new Subject<void>();
    isSaving = false;
    saveInProgress = false;
    userId: number;
    currentChecklistId: number | null = null;
    selectedProduct!: ProductBasicInfo | undefined;
    currentPrePacking!: ProductPrePackingInfo;
    showPrePackingForm: boolean = false;
    checklistDates = {
        1: null as Date | string | null,
        2: null as Date | string | null,
        3: null as Date | string | null,
        5: null as Date | string | null
    };

    constructor(
        private restService: RestService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {
        this.route.queryParams.subscribe((params) => {
            this.productionId = params['productionId'] ? Number(params['productionId']) : null;
            this.currentStep = params['activeTab'] ? Number(params['activeTab']) : null;
            if (this.currentStep) {
                this.activeTab = this.currentStep;
            }

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
                this.checklistDates[1] = new Date(data.preMakingDate);
                this.onDateChanged(1, this.checklistDates[1])
                this.checklistDates[2] = new Date(data.makingDate);
                this.onDateChanged(2, this.checklistDates[2])
                this.checklistDates[3] = new Date(data.prePackingDate);
                this.onDateChanged(3, this.checklistDates[3]);
                this.checklistDates[5] = new Date(data.postPackingDate);
                this.onDateChanged(5, this.checklistDates[5])
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
        var updates = []
        const update = {
            productionRunId: productionRunId,
            checklistId: checklistId,
            taskId: task.taskId,
            // productId: product.productId,
            isCompleted: task.isCompleted
        };
        updates.push(update);
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
            ph: preObj.prePackingData.ph,
            time: this.formatLocalTime(new Date(preObj.prePackingData.time)),
            isPhCalibrated: preObj.prePackingData.isPhCalibrated,
            detailId: preObj.prePackingData.detailId || 0,

        };

        this.restService.savePrePackingData(payload).subscribe({
            next: () => this.afterSave(),
            error: () => console.error('Save Failed')
        });
    }

    goToExit() {
        this.router.navigate(['/app'])
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

    onProductSelected() {
        if (this.selectedProduct) {
            debugger;
            this.currentPrePacking = {
                productId: this.selectedProduct.productId,
                productName: this.selectedProduct.productName,
                batchNo: this.selectedProduct.batchNo,
                validBatch: this.selectedProduct.validBatch,
                batchNoDate: null,
                prePackingData: {
                    temperature: null,
                    ph: null,
                    time: new Date(),
                    isPhCalibrated: false,
                    isCompleted: false,
                    completedAt: null,
                    detailId: 0
                },
            };
            this.showPrePackingForm = true;
        }
    }

    afterSave() {
        this.loadProductionRunData();
        this.currentPrePacking = {} as ProductPrePackingInfo;
        this.selectedProduct = {} as ProductStatus;
        this.showPrePackingForm = false;
    }

    updateProductBoxCount(product: any) {
        if (product.numberOfBoxes < 0) {
            product.numberOfBoxes = 0;
            return;
        }
        if (product.numberOfBoxes > 99) {
            product.numberOfBoxes = 0;
            return;
        }
        const request: UpdateBoxCountRequest = {
            productionRunId: this.productionId!,
            productId: product.productId,
            numberOfBoxes: product.numberOfBoxes
        };

        this.restService.updateBoxCount(request).subscribe({
            next: () => console.log('Box count updated'),
            error: (err) => console.log(err)
        });
    }


    tabs = [
        { id: 1, label: 'Pre Making', icon: 'pi pi-list-check' },
        { id: 2, label: 'Making', icon: 'pi pi-cog' },
        { id: 3, label: 'Pre Packing', icon: 'pi pi-box' },
        { id: 4, label: 'Packing', icon: 'pi pi-gift' },
        { id: 5, label: 'Post Packing', icon: 'pi pi-gift' }
    ];

    activeTab = 1;
    isMenuOpen: boolean = false;
    showMenu: boolean = false;
    getChecklistTasks(checklistId: number) {
        const checklist = this.productionRunData.sharedChecklists.find(c => c.checklistId === checklistId);
        return checklist ? checklist.tasks : [];
    }


    goBack(): void {
        this.router.navigate(['/app']);
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }


    exportAsPDF(): void {
        this.isMenuOpen = false;
        this.messageService.add({ severity: 'info', summary: 'Export', detail: 'PDF export initiated' });
    }

    canSavePrePacking(): boolean {
        if (!this.currentPrePacking) return false;
        const data = this.currentPrePacking.prePackingData;
        return data.isPhCalibrated && data.temperature !== null && data.time !== null;
    }



    onCompleteProduction(): void {
        // Implement completion logic
        this.messageService.add({ severity: 'success', summary: 'Completed', detail: 'Production run completed' });
        this.router.navigate(['/app']);
    }

    onSaveAndExit(): void {
        // Implement save and exit logic
        this.messageService.add({ severity: 'info', summary: 'Saved', detail: 'Progress saved' });
        this.router.navigate(['/app']);
    }

    onDateChanged(checklistId: number, newDate: Date) {
        const request: UpdateChecklistDateRequest = {
            productionRunId: this.productionId!,
            checklistId: checklistId,
            date: this.formatLocalTime(new Date(newDate)),
        }

        this.restService.updateChecklistDate(request).subscribe({
            next: () => console.log('Checklist date updated'),
            error: (err) => console.log(err)
        });
    }

    onDeletePrePacking(detailId: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this pre-packing record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.restService.deletePrePackingDetail(this.productionId!, detailId)
                    .subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Pre-packing record deleted'
                            });
                            this.loadProductionRunData();
                        },
                        error: (err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to delete pre-packing record'
                            });
                        }
                    });
            }
        });
    }

    isTabCompleted(tabId: number): boolean {
        switch (tabId) {
            case 1: return this.isChecklistCompleted(1);
            case 2: return this.isChecklistCompleted(2);
            case 3: return this.isChecklistCompleted(3);
            case 4: return this.productionRunData?.prePackingList?.length > 0;
            case 5: return this.isChecklistCompleted(5);
            default: return false;
        }
    }
    isChecklistCompleted(checklistId: number): boolean {
        switch(checklistId) {
            case 4: // Pre-Packing - must have tasks completed AND pre-packing records
                const prePackingTasks = this.getChecklistTasks(4);
                const tasksCompleted = prePackingTasks.length > 0 && 
                                     prePackingTasks.every(task => task.isCompleted);
                const hasPrePackingRecords = this.productionRunData?.prePackingList?.length > 0;
                return tasksCompleted && hasPrePackingRecords;
                
            case 5: // Post-Packing - must have tasks completed AND all products have boxes
                const postPackingTasks = this.getChecklistTasks(5);
                const postTasksCompleted = postPackingTasks.length > 0 && 
                                         postPackingTasks.every(task => task.isCompleted);
                return postTasksCompleted && this.allProductsHaveBoxes();
                
            default: // Other checklists (1-3) - just check tasks
                const tasks = this.getChecklistTasks(checklistId);
                return tasks.length > 0 && tasks.every(task => task.isCompleted);
        }
    }

    canProceedToNextTab(): boolean {
        switch (this.activeTab) {
            case 1: return this.isChecklistCompleted(1);
            case 2: return this.isChecklistCompleted(2);
            case 3: return this.isChecklistCompleted(3);
            case 4:
                return this.productionRunData?.prePackingList?.length > 0;
            case 5: return this.isChecklistCompleted(5);
            default: return false;
        }
    }

    goToNextTab(): void {
        if (this.canProceedToNextTab()) {
            this.activeTab += 1;
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Incomplete Checklist',
                detail: 'Please complete all tasks in the current checklist before proceeding'
            });
        }
    }


    isTabAccessible(tabId: number): boolean {
        // Always allow going back to previous tabs
        if (tabId < this.activeTab) return true;
        
        // Current tab is always accessible
        if (tabId === this.activeTab) return true;
        
        // For tabs after current, check requirements
        switch (tabId) {
            case 2: return this.isTabCompleted(1); // Making requires Pre-Making
            case 3: return this.isTabCompleted(1) && this.isTabCompleted(2); // Pre-Packing
            case 4: return this.isTabCompleted(1) && this.isTabCompleted(2) && this.isTabCompleted(3); // Packing
            case 5: return this.isTabCompleted(4); // Post Packing requires Packing complete
            default: return false;
        }
    }
    selectTab(tabId: number): void {
        if (!this.isTabAccessible(tabId)) {
            const currentTabName = this.tabs.find(t => t.id === this.activeTab)?.label || 'current step';
            this.messageService.add({
                severity: 'warn',
                summary: 'Complete Required Steps',
                detail: `Please complete ${currentTabName} and all previous steps before proceeding`
            });
            return;
        }
        this.activeTab = tabId;
    }

    canCompleteProduction(): boolean {
        return this.isChecklistCompleted(5);
    }

    isNextLogicalTab(tabId: number): boolean {
        // Find first incomplete tab in sequence
        if (!this.isTabCompleted(1)) return tabId === 1;
        if (!this.isTabCompleted(2)) return tabId === 2;
        if (!this.isTabCompleted(3)) return tabId === 3;
        if (!this.isTabCompleted(4)) return tabId === 4;
        if (!this.isTabCompleted(5)) return tabId === 5;
        
        return false;
    }

    allProductsHaveBoxes(): boolean {
        return this.productionRunData?.products?.every(
            product => product.numberOfBoxes > 0
        ) ?? false;
    }
}    