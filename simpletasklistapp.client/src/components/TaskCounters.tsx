import type { TaskItemCounts } from "../types/taskItemCounts";
import "./TaskCounters.css";

interface TaskCountersProps {
	counts: TaskItemCounts;
}

export const TaskCounters: React.FC<TaskCountersProps> = ({ counts }) => {
	return (
		<div className="task-counters">
			<div className="counter-card pending">
				<div className="counter-label">Pending</div>
				<div className="counter-value">{counts.pending}</div>
			</div>
			<div className="counter-card in-progress">
				<div className="counter-label">In Progress</div>
				<div className="counter-value">{counts.inProgress}</div>
			</div>
			<div className="counter-card completed">
				<div className="counter-label">Completed</div>
				<div className="counter-value">{counts.completed}</div>
			</div>
		</div>
	);
};
