import { api } from "./api";
import type { TaskItem } from "../types/taskItem";
import type { TaskItemCounts } from "../types/taskItemCounts";
import type { TaskItemStatusType } from "../types/taskItemStatus";

export const taskService = {
	async getAllTasks(taskListId?: number): Promise<TaskItem[]> {
		const params = taskListId ? { taskListId } : {};
		const response = await api.get<TaskItem[]>("/tasks", { params });
		return response.data;
	},

	async getTaskById(id: number): Promise<TaskItem> {
		const response = await api.get<TaskItem>(`/tasks/${id}`);
		return response.data;
	},

	async createTask(task: {
		title: string;
		description?: string;
		status: TaskItemStatusType;
		taskListId: number;
	}): Promise<TaskItem> {
		console.log("create task:", task);
		const response = await api.post<TaskItem>("/tasks", task);
		return response.data;
	},

	async updateTask(
		id: number,
		task: { title: string; description?: string; status: TaskItemStatusType }
	): Promise<TaskItem> {
		const response = await api.put<TaskItem>(`/tasks/${id}`, task);
		return response.data;
	},

	async deleteTask(id: number): Promise<void> {
		await api.delete(`/tasks/${id}`);
	},

	async updateTaskStatus(
		id: number,
		status: TaskItemStatusType
	): Promise<void> {
		await api.patch(`/tasks/${id}/status`, { status });
	},

	async getTaskCounts(taskListId?: number): Promise<TaskItemCounts> {
		const params = taskListId ? { taskListId } : {};
		const response = await api.get<TaskItemCounts>("/tasks/counts", { params });
		return response.data;
	},

	async uploadProfileImage(file: File): Promise<{ imagePath: string }> {
		const formData = new FormData();
		formData.append("file", file);
		const response = await api.post<{ imagePath: string }>(
			"/profile/image",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	},

	async getProfileImageUrl(): Promise<string | null> {
		try {
			const response = await api.get<{ imagePath: string }>("/profile/image");
			return response.data.imagePath;
		} catch (error: unknown) {
			console.error("Failed to get profile image:", error);
			return null;
		}
	},

	async deleteProfileImage(): Promise<void> {
		await api.delete("/profile/image");
	},
};
