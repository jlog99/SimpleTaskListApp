import { api } from "./api";
import type { TaskItemList } from "../types/taskItemList";

export const taskListService = {
	async getAllTaskLists(): Promise<TaskItemList[]> {
		const response = await api.get<TaskItemList[]>("/tasklists");
		return response.data;
	},

	async getTaskListById(id: number): Promise<TaskItemList> {
		const response = await api.get<TaskItemList>(`/tasklists/${id}`);
		return response.data;
	},

	async createTaskList(name: string): Promise<TaskItemList> {
		const response = await api.post<TaskItemList>("/tasklists", { name });
		return response.data;
	},

	async updateTaskList(id: number, name: string): Promise<TaskItemList> {
		const response = await api.put<TaskItemList>(`/tasklists/${id}`, { name });
		return response.data;
	},

	async deleteTaskList(id: number): Promise<void> {
		await api.delete(`/tasklists/${id}`);
	},
};
