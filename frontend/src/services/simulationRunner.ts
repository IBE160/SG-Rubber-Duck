// This is a simplified, client-side simulation runner.
// A real implementation would run on the backend (e.g., using Celery, Redis, and WebSockets).

import { AppDispatch, RootState } from '../store/store';
import { tick, stopSimulation } from '../store/simulationSlice';
import { Task, Risk, Resource, SimulationEvent } from '../types/domain';

// A proxy class to manage the state of tasks during simulation
class SimTask {
    original: Task;
    remainingDuration: number;
    progress: number;
    isFinished: boolean = false;
    isActive: boolean = false;

    constructor(task: Task) {
        this.original = task;
        this.remainingDuration = task.duration;
        this.progress = task.progress;
    }
}

export class SimulationRunner {
    private intervalId: number | null = null;
    private day = 0;
    
    private tasks: Map<string, SimTask>;
    private risks: Risk[];
    private resources: Map<string, Resource>;
    private projectStartDate: Date;
    
    private dispatch: AppDispatch;
    private getState: () => RootState;

    constructor(initialTasks: Task[], initialRisks: Risk[], initialResources: Resource[], dispatch: AppDispatch, getState: () => RootState) {
        this.tasks = new Map(initialTasks.map(t => [t.id, new SimTask(t)]));
        this.risks = initialRisks;
        this.resources = new Map(initialResources.map(r => [r.id, r]));
        this.dispatch = dispatch;
        this.getState = getState;

        // Determine project start date
        this.projectStartDate = new Date(Math.min(...initialTasks.map(t => new Date(t.start_date).getTime())));
    }

    start() {
        this.stop(); // Ensure no other interval is running
        const currentSpeed = this.getState().simulation.speed;
        if (currentSpeed > 0) {
            this.intervalId = window.setInterval(() => this.runTick(), 1000 / currentSpeed);
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private runTick() {
        if (this.getState().simulation.status !== 'running') {
            this.stop();
            return;
        }

        this.day++;
        const newEvents: SimulationEvent[] = [];
        let actualCostToday = 0;

        // --- Update Tasks ---
        this.tasks.forEach(simTask => {
            if (simTask.isFinished) return;

            const canStart = simTask.original.predecessors.every(pId => this.tasks.get(pId)?.isFinished);
            if (!canStart) return;

            if (!simTask.isActive) {
                simTask.isActive = true;
                newEvents.push({ timestamp: Date.now(), type: 'TASK_START', message: `Task started: ${simTask.original.text}` });
            }
            
            if(simTask.original.resource_id) {
                actualCostToday += this.resources.get(simTask.original.resource_id)?.cost_per_day || 0;
            }

            if (simTask.remainingDuration > 0) {
                simTask.remainingDuration--;
                simTask.progress = (simTask.original.duration - simTask.remainingDuration) / simTask.original.duration;
            }

            if (simTask.remainingDuration <= 0 && !simTask.isFinished) {
                simTask.isFinished = true;
                simTask.isActive = false;
                simTask.progress = 1;
                newEvents.push({ timestamp: Date.now(), type: 'TASK_END', message: `Task finished: ${simTask.original.text}` });
            }
        });
        
        // --- Process Risks ---
        this.risks.forEach(risk => {
            if (Math.random() < (risk.probability / 365)) {
                newEvents.push({ timestamp: Date.now(), type: 'RISK_EVENT', message: `Risk occurred: ${risk.description}` });
                actualCostToday += risk.cost_impact;
                risk.affected_task_ids.forEach(taskId => {
                    const task = this.tasks.get(taskId);
                    if (task && !task.isFinished) {
                        task.remainingDuration += risk.duration_impact;
                    }
                });
            }
        });

        // --- Calculate KPIs ---
        let pv = 0;
        let ev = 0;
        const msPerDay = 1000 * 60 * 60 * 24;
        const projectStartMs = this.projectStartDate.getTime();
        const previousAc = this.getState().simulation.kpis.ac;
        const ac = previousAc + actualCostToday;
        
        this.tasks.forEach(simTask => {
            ev += simTask.original.cost * simTask.progress;
            
            const taskStartDay = (new Date(simTask.original.start_date).getTime() - projectStartMs) / msPerDay;
            if (this.day >= taskStartDay) {
                const plannedProgress = Math.min(1, Math.max(0, (this.day - taskStartDay) / simTask.original.duration));
                pv += simTask.original.cost * plannedProgress;
            }
        });
        
        const sv = ev - pv;
        const cv = ev - ac;

        // --- Dispatch Update ---
        const updatedTasks = Array.from(this.tasks.values()).map(st => ({
            ...st.original,
            progress: st.progress,
        }));

        this.dispatch(tick({
            day: this.day,
            kpis: { pv, ev, ac, sv, cv, rei: 0 },
            newEvents,
            updatedTasks,
        }));

        // Check for simulation end
        const allFinished = Array.from(this.tasks.values()).every(t => t.isFinished);
        if (allFinished) {
            this.stop();
            this.dispatch(stopSimulation());
        }
    }
}