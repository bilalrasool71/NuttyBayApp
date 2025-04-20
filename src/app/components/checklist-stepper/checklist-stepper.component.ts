import { Component, OnDestroy, OnInit } from '@angular/core';
import { INBChecklist, INBChecklistTasks, IPrePackingData } from '../../core/interfaces/domain.interface';
import { RestService } from '../../services/rest-service/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UtilsModule } from '../../core/utilities/utils.module';

@Component({
    selector: 'app-checklist-stepper',
    templateUrl: './checklist-stepper.component.html',
    styleUrls: ['./checklist-stepper.component.scss'],
    imports: [UtilsModule]
})
export class ChecklistStepperComponent implements OnInit, OnDestroy {
    allChecklists: INBChecklist[] = [];
    allTasksForChecklist: INBChecklistTasks[] = [];
    productionId: number | null = null;
    productId: number | null = null;
    selectedDate: Date | null = null;
    currentValue: number = 1;
    prePackingData: IPrePackingData = {
        temperature: 0,
        pH: 0,
        time: new Date()
    };
    private destroy$ = new Subject<void>();
    isSaving = false;
    saveInProgress = false;
    userId: number;
    currentChecklistId: number | null = null;

    constructor(
        private restService: RestService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.route.queryParams.subscribe((params) => {
            this.productionId = params['productionId'] ? Number(params['productionId']) : null;
            this.productId = params['productId'] ? Number(params['productId']) : null;
            this.selectedDate = params['date'] ? new Date(params['date']) : null;
        });
        this.userId = this.authService.getUserData().userId ?? 0;
    }

    ngOnInit(): void {
        this.loadChecklists();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadChecklists() {
        this.restService.getAllChecklists()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: INBChecklist[]) => {
                    this.allChecklists = data.sort((a, b) => a.checklistOrder - b.checklistOrder);
                    this.loadChecklistTasks(this.currentValue);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load checklists'
                    });
                }
            });
    }

    onStepChange(value: any) {
        this.currentValue = value;
        this.loadChecklistTasks(value);
    }

    loadChecklistTasks(checklistId: number) {
        this.currentChecklistId = checklistId;
        const currentChecklist = this.allChecklists.find(c => c.checklistId === checklistId);

        // Skip loading tasks for PrePacking (checklistType === 2)
        if (currentChecklist?.checklistType === 2) {
            this.allTasksForChecklist = [];
            return;
        }

        this.restService.getTasksByChecklist(checklistId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: INBChecklistTasks[]) => {
                    this.allTasksForChecklist = data.map(task => ({
                        ...task,
                        isCompleted: task.isCompleted ?? false
                    }));
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load tasks'
                    });
                }
            });
    }

    async saveChecklistData() {
        if (this.saveInProgress || !this.currentChecklistId) return;
        
        this.saveInProgress = true;
        this.isSaving = true;
        
        try {
            const currentChecklist = this.allChecklists.find(c => c.checklistId === this.currentChecklistId);
            if (!currentChecklist) return;

            // For regular checklists, save tasks first
            if (currentChecklist.checklistType !== 2) {
                await this.saveRegularChecklistTasks();
            }

            // Then mark checklist as completed
            if (currentChecklist.checklistType === 2) {
                await this.savePrePackingData(currentChecklist.checklistId);
            } else {
                // For regular checklists, mark as completed after tasks are saved
                await this.markChecklistAsCompleted(currentChecklist.checklistId);
            }

            // Refresh data to show updates
            await this.refreshChecklistData();

            // Check if all checklists are completed
            const allCompleted = await this.checkAllChecklistsCompleted(this.productionId!);
            if (allCompleted) {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Completed', 
                    detail: 'All checklists are completed for this production run',
                    life: 5000
                });
                this.router.navigate(['/production-runs', this.userId, 'Completed']);
            } else {
                // Move to next step if not last checklist
                if (this.currentValue < this.allChecklists.length) {
                    this.currentValue++;
                    this.loadChecklistTasks(this.currentValue);
                }
            }
        } catch (error) {
            console.error('Error saving checklist data:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save checklist data',
                life: 5000
            });
        } finally {
            this.saveInProgress = false;
            this.isSaving = false;
        }
    }

    private async refreshChecklistData() {
        if (!this.productionId || !this.currentChecklistId) return;
        
        try {
            // Refresh the current checklist data
            const updatedData = await this.restService.getProductionRunDetails(this.productionId)
                .pipe(takeUntil(this.destroy$))
                .toPromise();

            if (updatedData && updatedData.checklists) {
                const updatedChecklist = updatedData.checklists.find(
                    (c: any) => c.checklistId === this.currentChecklistId
                );

                if (updatedChecklist) {
                    // Update the local checklist state
                    const index = this.allChecklists.findIndex(
                        c => c.checklistId === this.currentChecklistId
                    );
                    if (index !== -1) {
                        this.allChecklists[index] = {
                            ...this.allChecklists[index],
                            isCompleted: updatedChecklist.isCompleted
                        };
                    }

                    // Update tasks if this isn't PrePacking
                    if (updatedChecklist.checklistType !== 2) {
                        this.allTasksForChecklist = updatedChecklist.tasks.map((task: any) => ({
                            ...task,
                            isCompleted: task.isCompleted
                        }));
                    }
                }
            }
        } catch (error) {
            console.error('Error refreshing checklist data:', error);
        }
    }

    private async markChecklistAsCompleted(checklistId: number): Promise<void> {
        try {
            await this.restService.completeChecklist(checklistId, {
                temperature: null,
                pH: null,
                time: null
            }).pipe(takeUntil(this.destroy$)).toPromise();
        } catch (error) {
            console.error('Error marking checklist as completed:', error);
            throw error;
        }
    }

    private async savePrePackingData(checklistId: number): Promise<void> {
        if (this.prePackingData.temperature === null || 
            this.prePackingData.pH === null || 
            this.prePackingData.time === null) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Please fill all PrePacking measurements', 
                life: 5000 
            });
            throw new Error('Missing PrePacking data');
        }

        try {
            const payload = {
                temperature: Number(this.prePackingData.temperature),
                pH: Number(this.prePackingData.pH),
                time: new Date(this.prePackingData.time)
            };
            
            await this.restService.completeChecklist(checklistId, payload)
                .pipe(takeUntil(this.destroy$))
                .toPromise();

            this.messageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'PrePacking data saved successfully', 
                life: 5000 
            });
        } catch (error) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Failed to save PrePacking data', 
                life: 5000 
            });
            throw error;
        }
    }

    private async saveRegularChecklistTasks(): Promise<void> {
        const tasksToUpdate = this.allTasksForChecklist.filter(task => task.isCompleted);
        if (tasksToUpdate.length === 0) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Warning', 
                detail: 'No tasks completed', 
                life: 5000 
            });
            return;
        }

        const updatePromises = tasksToUpdate.map(task => {
            return new Promise<void>((resolve, reject) => {
                this.restService.updateTaskStatus(task.taskId, {
                    isCompleted: task.isCompleted ?? false
                }).subscribe({
                    next: () => resolve(),
                    error: (err) => reject(err)
                });
            });
        });

        try {
            await Promise.all(updatePromises);
            this.messageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail: `Successfully updated ${tasksToUpdate.length} tasks`, 
                life: 5000 
            });
        } catch (error) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Some tasks failed to update', 
                life: 5000 
            });
            throw error;
        }
    }

    private async checkAllChecklistsCompleted(productionRunId: number): Promise<boolean> {
        try {
            const data = await this.restService.getProductionRunDetails(productionRunId)
                .pipe(takeUntil(this.destroy$))
                .toPromise();

            return data?.checklists?.every((checklist: any) => checklist.isCompleted) ?? false;
        } catch (error) {
            console.error("Error checking checklist completion", error);
            return false;
        }
    }
}