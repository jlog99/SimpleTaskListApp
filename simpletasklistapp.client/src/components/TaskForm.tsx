import { useState, useEffect } from "react";
import type { TaskItem } from "../types/taskItem";
import { TaskItemStatus } from "../types/taskItemStatus";
import type { TaskItemStatusType } from "../types/taskItemStatus";
import "./TaskForm.css";

interface TaskFormProps {
	task?: TaskItem;
	onSubmit: (task: {
		title: string;
		description?: string;
		status: TaskItemStatusType;
	}) => Promise<void>;
	onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
	task,
	onSubmit,
	onCancel,
}) => {
	const [title, setTitle] = useState(task?.title || "");
	const [description, setDescription] = useState(task?.description || "");
	const [status, setStatus] = useState(task?.status || TaskItemStatus.Pending);
	const [errors, setErrors] = useState<{ title?: string }>({});
	const [submitting, setSubmitting] = useState(false);

	// Update form fields when task prop changes
	useEffect(() => {
		if (task) {
			setTitle(task.title || "");
			setDescription(task.description || "");
			setStatus(task.status || TaskItemStatus.Pending);
		} else {
			// Reset form when task is cleared (creating new task)
			setTitle("");
			setDescription("");
			setStatus(TaskItemStatus.Pending);
		}
		setErrors({});
	}, [task]);

	const validate = (): boolean => {
		const newErrors: { title?: string } = {};
		if (!title.trim()) {
			newErrors.title = "Title is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setSubmitting(true);
		try {
			await onSubmit({
				title: title.trim(),
				description: description.trim() || undefined,
				status: status,
			});
			if (!task) {
				// Reset form only for new tasks
				setTitle("");
				setDescription("");
				setStatus(TaskItemStatus.Pending);
			}
		} catch (error) {
			console.error("Failed to save task:", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form
			className="task-form"
			onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="title">Title *</label>
				<input
					id="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className={errors.title ? "error" : ""}
					disabled={submitting}
				/>
				{errors.title && <span className="error-message">{errors.title}</span>}
			</div>

			<div className="form-group">
				<label htmlFor="description">Description</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={3}
					disabled={submitting}
				/>
			</div>

			<div className="form-group">
				<label htmlFor="status">Status</label>
				<select
					id="status"
					value={status}
					onChange={(e) =>
						setStatus(Number(e.target.value) as TaskItemStatusType)
					}
					disabled={submitting}>
					<option value={TaskItemStatus.Pending}>Pending</option>
					<option value={TaskItemStatus.InProgress}>In Progress</option>
					<option value={TaskItemStatus.Completed}>Completed</option>
				</select>
			</div>

			<div className="form-actions">
				<button
					type="submit"
					disabled={submitting}
					className="submit-button">
					{submitting ? "Saving..." : task ? "Update Task" : "Create Task"}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						disabled={submitting}
						className="cancel-button">
						Cancel
					</button>
				)}
			</div>
		</form>
	);
};
