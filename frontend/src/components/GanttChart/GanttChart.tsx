import React, { useEffect, useRef } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

const GanttChart: React.FC = () => {
  const ganttContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ganttContainer.current) {
      // Basic configuration
      gantt.config.date_format = '%Y-%m-%d %H:%i';
      gantt.config.scale_height = 50;
      gantt.config.scales = [
        { unit: 'day', step: 1, format: '%d %M' },
        { unit: 'month', step: 1, format: '%F %Y' }
      ];

      // Initialize the Gantt chart
      gantt.init(ganttContainer.current);

      // Sample data
      const tasks = {
        data: [
          { id: 1, text: 'Project #1', start_date: '2025-11-27', duration: 18, progress: 0.4, open: true },
          { id: 2, text: 'Task #1', start_date: '2025-11-28', duration: 8, progress: 0.6, parent: 1 },
          { id: 3, text: 'Task #2', start_date: '2025-12-06', duration: 8, progress: 0.2, parent: 1 }
        ],
        links: [
          { id: 1, source: 1, target: 2, type: '1' },
          { id: 2, source: 2, target: 3, type: '0' }
        ]
      };

      // Load data into the chart
      gantt.parse(tasks);
    }

    // Cleanup function
    return () => {
      gantt.clearAll();
    };
  }, []);

  return (
    <div 
      ref={ganttContainer} 
      style={{ width: '100%', height: '500px' }}
    ></div>
  );
};

export default GanttChart;
