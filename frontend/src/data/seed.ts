import type { Project, Task, Resource, Risk } from '../types/domain';

export const mockResources: Resource[] = [
  { id: 'res-1', name: 'Construction Crew A', cost_per_day: 2000 },
  { id: 'res-2', name: 'Heavy Machinery', cost_per_day: 3500 },
  { id: 'res-3', name: 'Electrical/Plumbing Team', cost_per_day: 2500 },
];

export const mockRisks: Risk[] = [
  { 
    id: 'risk-1', 
    description: 'Unexpectedly bad weather delays foundation work',
    likelihood: 'Medium',
    impact: 'Medium',
    probability: 0.3,
    cost_impact: 15000,
    duration_impact: 5,
    affected_task_ids: ['t-3'] 
  },
  { 
    id: 'risk-2', 
    description: 'Material delivery delay for structural steel',
    likelihood: 'Low',
    impact: 'High',
    probability: 0.1,
    cost_impact: 30000,
    duration_impact: 10,
    affected_task_ids: ['t-5', 't-6'] 
  },
  { 
    id: 'risk-3', 
    description: 'Sub-contractor for HVAC is unavailable',
    likelihood: 'Low',
    impact: 'Medium',
    probability: 0.15,
    cost_impact: 25000,
    duration_impact: 7,
    affected_task_ids: ['t-9'] 
  },
  {
    id: 'risk-4',
    description: 'Permit approval for electrical work is delayed',
    likelihood: 'Medium',
    impact: 'Low',
    probability: 0.4,
    cost_impact: 5000,
    duration_impact: 3,
    affected_task_ids: ['t-10']
  },
  {
    id: 'risk-5',
    description: 'Worker strike',
    likelihood: 'Low',
    impact: 'High',
    probability: 0.05,
    cost_impact: 100000,
    duration_impact: 15,
    affected_task_ids: ['t-5', 't-6', 't-7', 't-8', 't-9', 't-10', 't-11', 't-12', 't-13', 't-14']
  }
];

export const mockTasks: Task[] = [
  // Phase 1: Planning & Site Prep
  { id: 't-1', text: 'Project Planning & Design', start_date: '2026-01-05', duration: 15, progress: 1, parent: null, predecessors: [], cost: 30000 },
  { id: 't-2', text: 'Site Survey and Clearing', start_date: '2026-01-26', duration: 5, progress: 1, parent: null, predecessors: ['t-1'], cost: 12000, resource_id: 'res-2' },
  { id: 't-3', text: 'Foundation Excavation & Pouring', start_date: '2026-02-02', duration: 10, progress: 0, parent: null, predecessors: ['t-2'], cost: 50000, resource_id: 'res-1' },

  // Phase 2: Superstructure
  { id: 't-4', text: 'Superstructure Work', start_date: '2026-02-16', duration: 0, progress: 0, parent: null, predecessors: ['t-3'], cost: 0 },
  { id: 't-5', text: 'Erect Structural Steel Frame', start_date: '2026-02-16', duration: 15, progress: 0, parent: 't-4', predecessors: ['t-3'], cost: 120000, resource_id: 'res-1' },
  { id: 't-6', text: 'Install Floor and Roof Structures', start_date: '2026-03-09', duration: 10, progress: 0, parent: 't-4', predecessors: ['t-5'], cost: 75000, resource_id: 'res-1' },

  // Phase 3: Building Envelope
  { id: 't-7', text: 'Building Envelope', start_date: '2026-03-23', duration: 0, progress: 0, parent: null, predecessors: ['t-6'], cost: 0 },
  { id: 't-8', text: 'Exterior Walls and Cladding', start_date: '2026-03-23', duration: 15, progress: 0, parent: 't-7', predecessors: ['t-6'], cost: 90000, resource_id: 'res-1' },
  { id: 't-9', text: 'Windows and Doors Installation', start_date: '2026-04-13', duration: 5, progress: 0, parent: 't-7', predecessors: ['t-8'], cost: 40000, resource_id: 'res-3' },

  // Phase 4: Interior and Systems
  { id: 't-10', text: 'MEP Systems', start_date: '2026-04-20', duration: 0, progress: 0, parent: null, predecessors: ['t-9'], cost: 0 },
  { id: 't-11', text: 'HVAC Rough-in', start_date: '2026-04-20', duration: 10, progress: 0, parent: 't-10', predecessors: ['t-9'], cost: 60000, resource_id: 'res-3' },
  { id: 't-12', text: 'Electrical and Plumbing Rough-in', start_date: '2026-05-04', duration: 10, progress: 0, parent: 't-10', predecessors: ['t-11'], cost: 65000, resource_id: 'res-3' },

  // Phase 5: Finishes
  { id: 't-13', text: 'Interior Finishes', start_date: '2026-05-18', duration: 0, progress: 0, parent: null, predecessors: ['t-12'], cost: 0 },
  { id: 't-14', text: 'Drywall and Painting', start_date: '2026-05-18', duration: 15, progress: 0, parent: 't-13', predecessors: ['t-12'], cost: 55000, resource_id: 'res-1' },
  { id: 't-15', text: 'Flooring Installation', start_date: '2026-06-08', duration: 5, progress: 0, parent: 't-13', predecessors: ['t-14'], cost: 35000, resource_id: 'res-1' },
  { id: 't-16', text: 'Install Fixtures', start_date: '2026-06-15', duration: 5, progress: 0, parent: 't-13', predecessors: ['t-15'], cost: 30000, resource_id: 'res-3' },

  // Phase 6: Finalization
  { id: 't-17', text: 'Landscaping', start_date: '2026-06-22', duration: 10, progress: 0, parent: null, predecessors: ['t-9'], cost: 40000, resource_id: 'res-1' },
  { id: 't-18', text: 'Final Inspections', start_date: '2026-07-06', duration: 5, progress: 0, parent: null, predecessors: ['t-16', 't-17'], cost: 5000 },
  { id: 't-19', text: 'Project Handover', start_date: '2026-07-13', duration: 1, progress: 0, parent: null, predecessors: ['t-18'], cost: 1000 },
];
const totalCost = mockTasks.reduce((acc, task) => acc + task.cost, 0);

export const mockProjects: Project[] = [
  { 
    id: 'proj-1', 
    name: 'Campus Build',
    description: 'Construction of a new multi-purpose building on the main campus.',
    budget: totalCost * 1.1, // Budget is 110% of planned cost
    contingency: 15, // 15%
  },
  { 
    id: 'proj-2', 
    name: 'Library Renovation',
    description: 'Complete overhaul of the west wing of the central library.',
    budget: 500000,
    contingency: 20,
  },
];
