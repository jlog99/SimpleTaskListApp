import { useState, useEffect } from "react";
import type { TaskItem } from "../types/taskItem";
import type { TaskItemCounts } from "../types/taskItemCounts";
import type { TaskItemStatusType } from "../types/taskItemStatus";
import type { TaskItemList as TaskListType } from "../types/taskItemList";
import { taskService } from "../services/taskService";
import { taskListService } from "../services/taskListService";
import { ProfileImage } from "./ProfileImage";
import { TaskCounters } from "./TaskCounters";
import { TaskList } from "./TaskList";
import { TaskListSidebar } from "./TaskListSidebar";
import "./Dashboard.css";
import { AxiosError } from "axios";

export const Dashboard: React.FC = () => {
	const [tasks, setTasks] = useState<TaskItem[]>([]);
	const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
	const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(
		null
	);
	const [counts, setCounts] = useState<TaskItemCounts>({
		pending: 0,
		inProgress: 0,
		completed: 0,
	});
	const [editingTask, setEditingTask] = useState<TaskItem | undefined>();
	const [addingTask, setAddingTask] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadTaskLists();
	}, []);

	useEffect(() => {
		if (selectedTaskListId !== null) {
			loadTasks();
			loadCounts();
		}
	}, [selectedTaskListId]);

	const loadTaskLists = async () => {
		try {
			const loadedTaskLists = await taskListService.getAllTaskLists();
			setTaskLists(loadedTaskLists);

			// Select first task list if none selected and task lists exist
			if (selectedTaskListId === null && loadedTaskLists.length > 0) {
				setSelectedTaskListId(loadedTaskLists[0].id);
			}
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to load task lists. Please try again."
			);
			console.error("Failed to load task lists:", err);
		}
	};

	const loadTasks = async () => {
		if (selectedTaskListId === null) {
			setTasks([]);
			return;
		}

		try {
			setLoading(true);
			const loadedTasks = await taskService.getAllTasks(selectedTaskListId);
			setTasks(loadedTasks);
			setError(null);
		} catch (err) {
			setError("Failed to load tasks. Please try again.");
			console.error("Failed to load tasks:", err);
		} finally {
			setLoading(false);
		}
	};

	const loadCounts = async () => {
		if (selectedTaskListId === null) {
			setCounts({ pending: 0, inProgress: 0, completed: 0 });
			return;
		}

		try {
			const loadedCounts = await taskService.getTaskCounts(selectedTaskListId);
			setCounts(loadedCounts);
		} catch (err) {
			console.error("Failed to load counts:", err);
		}
	};

	const handleCreateTask = async (taskData: {
		title: string;
		description?: string;
		status: TaskItemStatusType;
	}) => {
		if (selectedTaskListId === null) {
			setError("Please select a task list first.");
			throw new Error("No task list selected");
		}

		try {
			await taskService.createTask({
				...taskData,
				taskListId: selectedTaskListId,
			});
			setAddingTask(false); // Hide form after successful creation
			await loadTasks();
			await loadCounts();
			setError(null);
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message ||
							"Failed to create task. Please try again."
					: "Failed to create task. Please try again."
			);
		}
	};

	const handleUpdateTask = async (taskData: {
		title: string;
		description?: string;
		status: TaskItemStatusType;
	}) => {
		if (!editingTask) return;

		try {
			await taskService.updateTask(editingTask.id, taskData);
			setEditingTask(undefined);
			await loadTasks();
			await loadCounts();
			setError(null);
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message ||
							"Failed to update task. Please try again."
					: "Failed to update task. Please try again."
			);
		}
	};

	const handleDeleteTask = async (id: number) => {
		try {
			await taskService.deleteTask(id);
			await loadTasks();
			await loadCounts();
			setError(null);
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message ||
							"Failed to delete task. Please try again."
					: "Failed to delete task. Please try again."
			);
		}
	};

	const handleStatusChange = async (id: number, status: TaskItemStatusType) => {
		try {
			await taskService.updateTaskStatus(id, status);
			await loadTasks();
			await loadCounts();
			setError(null);
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message ||
							"Failed to update task status. Please try again."
					: "Failed to update task status. Please try again."
			);
		}
	};

	const handleAdd = () => {
		setAddingTask(true);
		setEditingTask(undefined); // Clear editing when adding
	};

	const handleEdit = (task: TaskItem) => {
		setEditingTask(task);
		setAddingTask(false); // Clear adding when editing
	};

	const handleCancelEdit = () => {
		setEditingTask(undefined);
		setAddingTask(false); // Also clear adding state
	};

	const handleTaskListSelect = (taskListId: number) => {
		setSelectedTaskListId(taskListId);
		setEditingTask(undefined);
		setAddingTask(false); // Clear adding state when switching task lists
	};

	const handleTaskListsChange = () => {
		loadTaskLists();
	};

	return (
		<div className="dashboard">
			<header className="dashboard-header">
				<h1>Task List Manager</h1>
				<ProfileImage />
			</header>

			{error && (
				<div className="error-banner">
					{error}
					<button
						onClick={() => setError(null)}
						className="error-close">
						×
					</button>
				</div>
			)}

			<div className="dashboard-layout">
				<TaskListSidebar
					taskLists={taskLists}
					selectedTaskListId={selectedTaskListId}
					onTaskListSelect={handleTaskListSelect}
					onTaskListsChange={handleTaskListsChange}
				/>

				<main className="dashboard-content">
					{selectedTaskListId === null ? (
						<div className="no-task-list-selected">
							<p>
								Please select a task list from the sidebar or create a new one.
							</p>
						</div>
					) : (
						<>
							<TaskCounters counts={counts} />

							<section className="task-section">
								<h2>Your Tasks ({tasks.length})</h2>
								{loading ? (
									<div className="loading">Loading tasks...</div>
								) : (
									<TaskList
										tasks={tasks}
										onEdit={handleEdit}
										onDelete={handleDeleteTask}
										onStatusChange={handleStatusChange}
										onAdd={handleAdd}
										addingTask={addingTask}
										editingTask={editingTask}
										onCreateTask={handleCreateTask}
										onUpdateTask={handleUpdateTask}
										onCancelEdit={handleCancelEdit}
									/>
								)}
							</section>
						</>
					)}
				</main>
			</div>
		</div>
	);
};
