import type { TaskItemStatus } from "../types/taskItemStatus";
import type { TaskItem } from "../types/taskItem";
import type { TaskItemStatusType } from "../types/taskItemStatus";
import { TaskItem as TaskItemComponent } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import "./TaskList.css";

interface TaskListProps {
	tasks: TaskItem[];
	onEdit: (task: TaskItem) => void;
	onDelete: (id: number) => Promise<void>;
	onStatusChange: (id: number, status: TaskItemStatus) => Promise<void>;
	onAdd: () => void;
	addingTask: boolean;
	editingTask?: TaskItem;
	onCreateTask: (taskData: {
		title: string;
		description?: string;
		status: TaskItemStatusType;
	}) => Promise<void>;
	onUpdateTask: (taskData: {
		title: string;
		description?: string;
		status: TaskItemStatusType;
	}) => Promise<void>;
	onCancelEdit: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
	tasks,
	onEdit,
	onDelete,
	onStatusChange,
	onAdd,
	addingTask,
	editingTask,
	onCreateTask,
	onUpdateTask,
	onCancelEdit,
}) => {
	const handleAdd = () => {
		onAdd();
	};

	return (
		<div className="task-list">
			{tasks.length === 0 && !addingTask && !editingTask && (
				<div className="task-list-empty">
					<p>No tasks yet. Create your first task above!</p>
				</div>
			)}
			{(addingTask || editingTask) && (
				<div className="task-form-container">
					<h3 className="task-form-title">
						{editingTask
							? `Edit Task - ${editingTask.title}`
							: "Create New Task"}
					</h3>
					<TaskForm
						task={editingTask}
						onSubmit={editingTask ? onUpdateTask : onCreateTask}
						onCancel={onCancelEdit}
					/>
				</div>
			)}

			{/* Should be able to sort by status, name and date/time */}
			{tasks.map((task) => (
				<TaskItemComponent
					key={task.id}
					task={task}
					onEdit={onEdit}
					onDelete={onDelete}
					onStatusChange={onStatusChange}
				/>
			))}
			<button
				className="add-button"
				onClick={handleAdd}>
				Add Task
			</button>
		</div>
	);
};
