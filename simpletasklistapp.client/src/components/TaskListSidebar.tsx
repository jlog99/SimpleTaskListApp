import { useState } from "react";
import type { TaskItemList } from "../types/taskItemList";
import { taskListService } from "../services/taskListService";
import "./TaskListSidebar.css";
import { AxiosError } from "axios";

interface TaskListSidebarProps {
	taskLists: TaskItemList[];
	selectedTaskListId: number | null;
	onTaskListSelect: (taskListId: number) => void;
	onTaskListsChange: () => void;
}

export const TaskListSidebar: React.FC<TaskListSidebarProps> = ({
	taskLists,
	selectedTaskListId,
	onTaskListSelect,
	onTaskListsChange,
}) => {
	const [isCreating, setIsCreating] = useState(false);
	const [newTaskListName, setNewTaskListName] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingName, setEditingName] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleCreate = async () => {
		if (!newTaskListName.trim()) {
			setError("Task list name cannot be empty");
			return;
		}

		try {
			setError(null);
			await taskListService.createTaskList(newTaskListName.trim());
			setNewTaskListName("");
			setIsCreating(false);
			onTaskListsChange();
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message ||
							"Failed to create task list. Please try again."
					: "Failed to create task list. Please try again."
			);
		}
	};

	const handleEdit = (taskList: TaskItemList) => {
		setEditingId(taskList.id);
		setEditingName(taskList.name);
		setError(null);
	};

	const handleUpdate = async (id: number) => {
		if (!editingName.trim()) {
			setError("Task list name cannot be empty");
			return;
		}

		try {
			setError(null);
			await taskListService.updateTaskList(id, editingName.trim());
			setEditingId(null);
			setEditingName("");
			onTaskListsChange();
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message ||
							"Failed to update task list. Please try again."
					: "Failed to update task list. Please try again."
			);
		}
	};

	const handleDelete = async (id: number) => {
		if (
			!confirm(
				"Are you sure you want to delete this task list? All tasks in it will be deleted."
			)
		) {
			return;
		}

		try {
			setError(null);
			await taskListService.deleteTaskList(id);
			if (selectedTaskListId === id) {
				onTaskListSelect(taskLists.find((tl) => tl.id !== id)?.id ?? 0);
			}
			onTaskListsChange();
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message ||
							"Failed to delete task list. Please try again."
					: "Failed to delete task list. Please try again."
			);
		}
	};

	const handleCancel = () => {
		setIsCreating(false);
		setNewTaskListName("");
		setEditingId(null);
		setEditingName("");
		setError(null);
	};

	return (
		<div className="task-list-sidebar">
			<div className="sidebar-header">
				<h2>Task Lists</h2>
				{!isCreating && (
					<button
						className="create-task-list-button"
						onClick={() => setIsCreating(true)}
						title="Create new task list">
						+
					</button>
				)}
			</div>

			{error && (
				<div className="sidebar-error">
					{error}
					<button
						onClick={() => setError(null)}
						className="error-close">
						×
					</button>
				</div>
			)}

			<div className="task-lists">
				{taskLists.map((taskList) => (
					<div
						key={taskList.id}
						className={`task-list-item ${
							selectedTaskListId === taskList.id ? "selected" : ""
						}`}>
						{editingId === taskList.id ? (
							<div className="task-list-edit-form">
								<input
									type="text"
									value={editingName}
									onChange={(e) => setEditingName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUpdate(taskList.id);
										} else if (e.key === "Escape") {
											handleCancel();
										}
									}}
									autoFocus
									className="task-list-name-input"
								/>
								<div className="task-list-edit-actions">
									<button
										onClick={() => handleUpdate(taskList.id)}
										className="save-button"
										title="Save">
										✓
									</button>
									<button
										onClick={handleCancel}
										className="cancel-button"
										title="Cancel">
										×
									</button>
								</div>
							</div>
						) : (
							<>
								<button
									className="task-list-name-button"
									onClick={() => onTaskListSelect(taskList.id)}>
									{taskList.name}
								</button>
								<div className="task-list-actions">
									<button
										onClick={() => handleEdit(taskList)}
										className="edit-button"
										title="Edit task list">
										✎
									</button>
									<button
										onClick={() => handleDelete(taskList.id)}
										className="delete-button"
										title="Delete task list">
										🗑
									</button>
								</div>
							</>
						)}
					</div>
				))}

				{isCreating && (
					<div className="task-list-item creating">
						<input
							type="text"
							value={newTaskListName}
							onChange={(e) => setNewTaskListName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleCreate();
								} else if (e.key === "Escape") {
									handleCancel();
								}
							}}
							placeholder="Enter task list name"
							autoFocus
							className="task-list-name-input"
						/>
						<div className="task-list-edit-actions">
							<button
								onClick={handleCreate}
								className="save-button"
								title="Create">
								✓
							</button>
							<button
								onClick={handleCancel}
								className="cancel-button"
								title="Cancel">
								×
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
