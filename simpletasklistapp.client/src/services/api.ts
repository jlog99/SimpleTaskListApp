import axios from 'axios';
import { TaskItemStatus } from '../types/taskItemStatus';
import type { TaskItemStatusType } from '../types/taskItemStatus';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5021';

// Helper to normalize status from API (handles both string and number)
const normalizeStatus = (status: unknown): TaskItemStatusType => {
	if (typeof status === 'number') {
		return status as TaskItemStatusType;
	}
	if (typeof status === 'string') {
		// Convert string status to number
		if (status === 'Pending' || status === '0') return TaskItemStatus.Pending;
		if (status === 'InProgress' || status === '1') return TaskItemStatus.InProgress;
		if (status === 'Completed' || status === '2') return TaskItemStatus.Completed;
	}
	return TaskItemStatus.Pending;
};

// Recursively normalize status in task objects
const normalizeTaskStatus = (data: any): any => {
	if (Array.isArray(data)) {
		return data.map(normalizeTaskStatus);
	}
	if (data && typeof data === 'object') {
		const normalized = { ...data };
		if ('status' in normalized) {
			normalized.status = normalizeStatus(normalized.status);
		}
		// Recursively process nested objects
		for (const key in normalized) {
			if (normalized[key] && typeof normalized[key] === 'object') {
				normalized[key] = normalizeTaskStatus(normalized[key]);
			}
		}
		return normalized;
	}
	return data;
};

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to normalize status values from API
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = normalizeTaskStatus(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
