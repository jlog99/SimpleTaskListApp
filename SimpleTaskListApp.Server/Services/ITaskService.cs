using SimpleTaskListApp.Server.Models;
using SimpleTaskListApp.Server.Models.DTOs;

namespace SimpleTaskListApp.Server.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItemDto>> GetAllTasksAsync(int? taskListId = null);
    Task<TaskItemDto?> GetTaskByIdAsync(int id);
    Task<TaskItemDto> CreateTaskAsync(CreateTaskItemDto dto);
    Task<TaskItemDto?> UpdateTaskAsync(int id, UpdateTaskItemDto dto);
    Task<bool> DeleteTaskAsync(int id);
    Task<bool> UpdateTaskStatusAsync(int id, TaskItemStatus status);
    Task<TaskItemCountsDto> GetTaskCountsAsync(int? taskListId = null);
}
