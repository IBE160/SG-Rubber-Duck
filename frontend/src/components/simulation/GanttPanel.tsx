import React, { useMemo, useState } from 'react';
import { Box, Chip, Stack, Tooltip, Typography, Slider, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAppSelector } from '../../store/hooks';
import { Risk, Task } from '../../types/domain';

type BarTask = Task & { affectedByRisk?: Risk[] };
const MS_PER_DAY = 86400000;

const computeCriticalPath = (tasks: Task[]): Set<number> => { // Return Set<number>
  if (!tasks.length) return new Set<number>();
  const duration = new Map(tasks.map((t) => [t.id, Math.max(0, t.duration)]));
  const preds = new Map(tasks.map((t) => [t.id, t.predecessors]));
  const memo = new Map<number, number>(); // Use number for ID

  const dfs = (id: number): number => { // Use number for ID
    if (memo.has(id)) return memo.get(id)!;
    const bestPred = Math.max(0, ...(preds.get(id) || []).map((p) => dfs(p)));
    const total = bestPred + (duration.get(id) ?? 0);
    memo.set(id, total);
    return total;
  };

  tasks.forEach((t) => dfs(t.id));
  const maxLen = Math.max(0, ...Array.from(memo.values()));
  const critical = new Set<number>(); // Use number for ID
  memo.forEach((len, id) => {
    if (len === maxLen) critical.add(id);
  });
  return critical;
};

// Compute timeline bounds
const getBounds = (tasks: Task[]) => {
  if (!tasks.length) return { min: new Date(), max: new Date(), totalDays: 1 };
  
  const starts = tasks.map((t) => new Date(t.start_date).getTime());
  const endTimes = tasks.map((t) => {
    const taskStartDate = new Date(t.start_date).getTime();
    const taskEndDate = taskStartDate + (t.duration * MS_PER_DAY);
    return taskEndDate;
  });

  const min = Math.min(...starts);
  const max = Math.max(...endTimes);

  const totalDays = Math.max(1, Math.ceil((max - min) / MS_PER_DAY));

  return { min: new Date(min), max: new Date(max), totalDays };
};

interface Props {
  tasksOverride?: Task[];
}

const GanttPanel: React.FC<Props> = ({ tasksOverride }) => {
  const { tasks: baseTasks, risks } = useAppSelector((state) => state.projects);
  const [zoom, setZoom] = useState<number>(1); // 0.5x, 1x, 2x
  const [showGrid] = useState(true);

  const tasks: BarTask[] = useMemo(() => {
    const source = tasksOverride && tasksOverride.length ? tasksOverride : (baseTasks || []);
    const processedTasks = source.map((t) => ({
      ...t,
      predecessors: t.predecessors || [],
      progress: t.progress ?? 0,
      affectedByRisk: risks.filter((r) => r.affected_task_ids?.includes(t.id)),
    }));
    console.log({ processedTasks }); // Log the tasks array
    return processedTasks;
  }, [baseTasks, risks, tasksOverride]);

  const criticalIds = useMemo(() => computeCriticalPath(tasks), [tasks]);
  const { min, totalDays } = useMemo(() => getBounds(tasks), [tasks]);

  const baseDayWidth = 14; // px per day
  const dayWidth = Math.max(6, baseDayWidth * zoom);

  const renderBar = (task: BarTask) => {
    const startOffset = Math.max(
      0,
      Math.round((new Date(task.start_date).getTime() - min.getTime()) / MS_PER_DAY),
    );
    const width = Math.max(6, task.duration * dayWidth);
    const left = startOffset * dayWidth;
    const progressWidth = Math.min(width, Math.max(0, Math.round(width * (task.progress ?? 0))));
    const isMilestone = task.duration === 0;
    const hasRisk = task.affectedByRisk && task.affectedByRisk.length > 0;
    const isCritical = criticalIds.has(task.id);
    const riskSeverity = task.affectedByRisk?.reduce((acc, r) => acc + r.cost_impact * r.probability, 0) ?? 0;

    return (
      <Box
        key={task.id}
        sx={{
          position: 'relative',
          pl: 1 + (task.parent ? 2 : 0),
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {task.text}
        </Typography>
        <Box sx={{ position: 'relative', height: 18, backgroundColor: 'action.hover' }}>
          <Box
            aria-label={`Task ${task.text}`}
            sx={{
              position: 'absolute',
              left,
              top: 0,
              height: 18,
              width: isMilestone ? 10 : width,
              bgcolor: isCritical ? 'error.light' : riskSeverity > 40000 ? 'warning.light' : 'primary.light',
              borderRadius: 0.5,
              outline: isCritical ? '2px solid #D32F2F' : 'none',
            }}
          >
            {!isMilestone && (
            <Box
              sx={{
                height: '100%',
                width: progressWidth,
                bgcolor: isCritical ? 'error.main' : 'primary.main',
                borderRadius: 0.5,
                transition: 'width 0.2s ease',
                opacity: riskSeverity > 40000 ? 0.9 : 1,
              }}
            />
            )}
          </Box>
          {hasRisk && (
            <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', right: 4, top: -6 }}>
              {task.affectedByRisk?.slice(0, 2).map((r) => (
                <Tooltip key={r.id} title={`Risk: ${r.description}`}>
                  <WarningAmberIcon color="warning" fontSize="small" />
                </Tooltip>
              ))}
              {task.affectedByRisk && task.affectedByRisk.length > 2 && (
                <Chip size="small" label={`+${task.affectedByRisk.length - 2}`} />
              )}
            </Stack>
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: 0.25 }}>
          <Chip size="small" label={`Start: ${task.start_date}`} />
          <Chip size="small" label={`Dur: ${task.duration}d`} />
          {task.predecessors.length > 0 && (
            <Chip size="small" label={`Pred: ${task.predecessors.join(', ')}`} sx={{ bgcolor: 'secondary.main' }} />
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflowX: 'auto', overflowY: 'auto', p: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">Timeline</Typography>
        <Box sx={{ width: 160 }}>
          <Slider
            aria-label="Zoom"
            size="small"
            min={0.5}
            max={2}
            step={0.25}
            value={zoom}
            valueLabelDisplay="auto"
            onChange={(_e, val) => setZoom(val as number)}
          />
        </Box>
        <Button size="small" variant="outlined" onClick={() => setZoom(1)}>
          Reset zoom
        </Button>
      </Stack>
      <Box
        role="presentation"
        aria-label="Gantt timeline"
        sx={{
          position: 'relative',
          minWidth: totalDays * dayWidth + 120,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
        }}
      >
        {/* Day scale */}
        <Box sx={{ display: 'flex', position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper' }}>
          {Array.from({ length: totalDays }).map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: dayWidth,
                height: 24,
                borderRight: showGrid ? '1px solid' : 'none',
                borderColor: showGrid ? 'divider' : 'transparent',
                fontSize: 10,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {idx + 1}
            </Box>
          ))}
        </Box>
        {/* Bars */}
        <Box>{tasks.map(renderBar)}</Box>
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
        <Chip label="Critical path" color="error" variant="outlined" />
        <Chip label="High risk impact" icon={<WarningAmberIcon color="warning" />} variant="outlined" />
        <Chip label="Zoom: scroll/slider; Reset to 1x" />
      </Stack>
    </Box>
  );
};

export default GanttPanel;
