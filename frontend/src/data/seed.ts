import type { Project, Task, Resource, Risk } from '../types/domain';

export const mockResources: Resource[] = [
  { id: 1, name: 'Construction Crew A', cost_per_day: 2000 },
  { id: 2, name: 'Heavy Machinery', cost_per_day: 3500 },
  { id: 3, name: 'Electrical/Plumbing Team', cost_per_day: 2500 },
];

export const mockRisks: Risk[] = [
  { 
    id: 1, 
    description: 'Unexpectedly bad weather delays foundation work',
    likelihood: 'Medium',
    impact: 'Medium',
    probability: 0.3,
    cost_impact: 15000,
    duration_impact: 5,
    affected_task_ids: [3] 
  },
  { 
    id: 2, 
    description: 'Material delivery delay for structural steel',
    likelihood: 'Low',
    impact: 'High',
    probability: 0.1,
    cost_impact: 30000,
    duration_impact: 10,
    affected_task_ids: [5, 6] 
  },
  { 
    id: 3, 
    description: 'Sub-contractor for HVAC is unavailable',
    likelihood: 'Low',
    impact: 'Medium',
    probability: 0.15,
    cost_impact: 25000,
    duration_impact: 7,
    affected_task_ids: [9] 
  },
  {
    id: 4,
    description: 'Permit approval for electrical work is delayed',
    likelihood: 'Medium',
    impact: 'Low',
    probability: 0.4,
    cost_impact: 5000,
    duration_impact: 3,
    affected_task_ids: [10]
  },
  {
    id: 5,
    description: 'Worker strike',
    likelihood: 'Low',
    impact: 'High',
    probability: 0.05,
    cost_impact: 100000,
    duration_impact: 15,
    affected_task_ids: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  }
];

export const mockTasks: Task[] = [
  // Phase 1: Planning & Site Prep
  { id: 1, text: 'Project Planning & Design', start_date: '2026-01-05', duration: 15, progress: 1, parent: null, predecessors: [], cost: 30000, project_id: 1 },
  { id: 2, text: 'Site Survey and Clearing', start_date: '2026-01-26', duration: 5, progress: 1, parent: null, predecessors: [1], cost: 12000, resource_id: 2, project_id: 1 },
  { id: 3, text: 'Foundation Excavation & Pouring', start_date: '2026-02-02', duration: 10, progress: 0, parent: null, predecessors: [2], cost: 50000, resource_id: 1, project_id: 1 },

  // Phase 2: Superstructure
  { id: 4, text: 'Superstructure Work', start_date: '2026-02-16', duration: 0, progress: 0, parent: null, predecessors: [3], cost: 0, project_id: 1 },
  { id: 5, text: 'Erect Structural Steel Frame', start_date: '2026-02-16', duration: 15, progress: 0, parent: 4, predecessors: [3], cost: 120000, resource_id: 1, project_id: 1 },
  { id: 6, text: 'Install Floor and Roof Structures', start_date: '2026-03-09', duration: 10, progress: 0, parent: 4, predecessors: [5], cost: 75000, resource_id: 1, project_id: 1 },

  // Phase 3: Building Envelope
  { id: 7, text: 'Building Envelope', start_date: '2026-03-23', duration: 0, progress: 0, parent: null, predecessors: [6], cost: 0, project_id: 1 },
  { id: 8, text: 'Exterior Walls and Cladding', start_date: '2026-03-23', duration: 15, progress: 0, parent: 7, predecessors: [6], cost: 90000, resource_id: 1, project_id: 1 },
  { id: 9, text: 'Windows and Doors Installation', start_date: '2026-04-13', duration: 5, progress: 0, parent: 7, predecessors: [8], cost: 40000, resource_id: 3, project_id: 1 },

  // Phase 4: Interior and Systems
  { id: 10, text: 'MEP Systems', start_date: '2026-04-20', duration: 0, progress: 0, parent: null, predecessors: [9], cost: 0, project_id: 1 },
  { id: 11, text: 'HVAC Rough-in', start_date: '2026-04-20', duration: 10, progress: 0, parent: 10, predecessors: [9], cost: 60000, resource_id: 3, project_id: 1 },
  { id: 12, text: 'Electrical and Plumbing Rough-in', start_date: '2026-05-04', duration: 10, progress: 0, parent: 10, predecessors: [11], cost: 65000, resource_id: 3, project_id: 1 },

  // Phase 5: Finishes
  { id: 13, text: 'Interior Finishes', start_date: '2026-05-18', duration: 0, progress: 0, parent: null, predecessors: [12], cost: 0, project_id: 1 },
  { id: 14, text: 'Drywall and Painting', start_date: '2026-05-18', duration: 15, progress: 0, parent: 13, predecessors: [12], cost: 55000, resource_id: 1, project_id: 1 },
  { id: 15, text: 'Flooring Installation', start_date: '2026-06-08', duration: 5, progress: 0, parent: 13, predecessors: [14], cost: 35000, resource_id: 1, project_id: 1 },
  { id: 16, text: 'Install Fixtures', start_date: '2026-06-15', duration: 5, progress: 0, parent: 13, predecessors: [15], cost: 30000, resource_id: 3, project_id: 1 },

  // Phase 6: Finalization
  { id: 17, text: 'Landscaping', start_date: '2026-06-22', duration: 10, progress: 0, parent: null, predecessors: [9], cost: 40000, resource_id: 1, project_id: 1 },
  { id: 18, text: 'Final Inspections', start_date: '2026-07-06', duration: 5, progress: 0, parent: null, predecessors: [16, 17], cost: 5000, project_id: 1 },
  { id: 19, text: 'Project Handover', start_date: '2026-07-13', duration: 1, progress: 0, parent: null, predecessors: [18], cost: 1000, project_id: 1 },
];
// Calculate total cost (simulated)

export const seedProjects: Project[] = [
  {
    id: 1,
    name: 'Office Complex Construction',
    description: 'A 12-story commercial building with underground parking.',
    budget: 12000000,
    contingency: 15, // 15%
    start_date: '2025-01-01',
    end_date: '2025-12-31'
  },
  {
    id: 2,
    name: 'Highway Expansion',
    description: 'Widening of 20km of highway including 2 bridges.',
    budget: 45000000,
    contingency: 20,
    start_date: '2025-03-01',
    end_date: '2026-06-30'
  },
];
