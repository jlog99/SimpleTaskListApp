import type { TaskItem as Task } from "../types/taskItem";
import { TaskItemStatus } from "../types/taskItemStatus";
import "./TaskItem.css";

interface TaskItemProps {
	task: Task;
	onEdit: (task: Task) => void;
	onDelete: (id: number) => Promise<void>;
	onStatusChange: (id: number, status: TaskItemStatus) => Promise<void>;
}

export const TaskItem: React.FC<TaskItemProps> = ({
	task,
	onEdit,
	onDelete,
	onStatusChange,
}) => {
	const getStatusClass = (status: TaskItemStatus) => {
		switch (status) {
			case TaskItemStatus.Pending:
				return "status-pending";
			case TaskItemStatus.InProgress:
				return "status-in-progress";
			case TaskItemStatus.Completed:
				return "status-completed";
			default:
				return "";
		}
	};

	const getStatusLabel = (status: TaskItemStatus) => {
		switch (status) {
			case TaskItemStatus.Pending:
				return "Pending";
			case TaskItemStatus.InProgress:
				return "In Progress";
			case TaskItemStatus.Completed:
				return "Completed";
			default:
				return status;
		}
	};

	const handleMarkDone = async () => {
		await onStatusChange(task.id, TaskItemStatus.Completed);
	};

	const handleMarkNotDone = async () => {
		const newStatus =
			task.status === TaskItemStatus.Completed
				? TaskItemStatus.InProgress
				: TaskItemStatus.Pending;
		await onStatusChange(task.id, newStatus);
	};

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this task?")) {
			await onDelete(task.id);
		}
	};

	return (
		<div className="task-item">
			<div className="task-content">
				<div className="task-header">
					<h3 className="task-title">
						{task.title} -{" "}
						<span className={`status-badge ${getStatusClass(task.status)}`}>
							{getStatusLabel(task.status)}
						</span>
					</h3>
				</div>
				{task.description && (
					<p className="task-description">{task.description}</p>
				)}
				<div className="task-meta">
					<span className="task-date">
						Created: {new Date(task.createdAt).toLocaleString()}
					</span>
				</div>
			</div>
			<div className="task-actions">
				{task.status !== TaskItemStatus.Completed ? (
					<button
						className="action-button done-button"
						onClick={handleMarkDone}
						title="Mark as done">
						✓ Mark as 'Done'
					</button>
				) : (
					<button
						className="action-button not-done-button"
						onClick={handleMarkNotDone}
						title="Mark as not done">
						↻ Mark as 'Not Done'
					</button>
				)}
				<button
					className="action-button edit-button"
					onClick={() => onEdit(task)}
					title="Edit task">
					✎
				</button>
				<button
					className="action-button delete-button"
					onClick={handleDelete}
					title="Delete task">
					🗑
				</button>
			</div>
		</div>
	);
};
