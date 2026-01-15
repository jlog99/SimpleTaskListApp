import type { TaskItemStatus } from "./taskItemStatus";

export interface TaskItem {
	id: number;
	title: string;
	description?: string;
	status: TaskItemStatus;
	createdAt: string;
	updatedAt: string;
	taskListId?: number;
}
