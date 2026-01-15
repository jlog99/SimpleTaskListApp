export const TaskItemStatus = {
	Pending: 0,
	InProgress: 1,
	Completed: 2,
} as const;

export type TaskItemStatusType =
	(typeof TaskItemStatus)[keyof typeof TaskItemStatus];

// Type alias for convenience (can be used interchangeably with TaskItemStatusType)
export type TaskItemStatus = TaskItemStatusType;
