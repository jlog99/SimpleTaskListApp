using Microsoft.EntityFrameworkCore;
using SimpleTaskListApp.Server.Data;
using SimpleTaskListApp.Server.Models;
using SimpleTaskListApp.Server.Models.DTOs;

namespace SimpleTaskListApp.Server.Services;

public class TaskService : ITaskService
{
    private readonly ApplicationDbContext _context;
    private const int DefaultUserId = 1; // Single-user mode

    public TaskService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItemDto>> GetAllTasksAsync(int? taskListId = null)
    {
        var query = _context.Tasks
            .Where(t => t.UserId == DefaultUserId);

        if (taskListId.HasValue)
        {
            query = query.Where(t => t.TaskListId == taskListId.Value);
        }

        var tasks = await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return tasks.Select(MapToDto);
    }

    public async Task<TaskItemDto?> GetTaskByIdAsync(int id)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == DefaultUserId);

        return task == null ? null : MapToDto(task);
    }

    public async Task<TaskItemDto> CreateTaskAsync(CreateTaskItemDto dto)
    {
        // Verify task list exists and belongs to user
        var taskList = await _context.TaskLists
            .FirstOrDefaultAsync(tl => tl.Id == dto.TaskListId && tl.UserId == DefaultUserId);

        if (taskList == null)
        {
            throw new InvalidOperationException($"Task list with id {dto.TaskListId} not found.");
        }

        // Check for uniqueness: Title must be unique within the TaskList
        var existingTask = await _context.Tasks
            .FirstOrDefaultAsync(t => t.TaskListId == dto.TaskListId && t.Title == dto.Title);

        if (existingTask != null)
        {
            throw new InvalidOperationException($"A task with the name '{dto.Title}' already exists in this task list.");
        }

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            UserId = DefaultUserId,
            TaskListId = dto.TaskListId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return MapToDto(task);
    }

    public async Task<TaskItemDto?> UpdateTaskAsync(int id, UpdateTaskItemDto dto)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == DefaultUserId);

        if (task == null)
            return null;

        // Check for uniqueness: Title must be unique within the TaskList (excluding current task)
        if (task.TaskListId.HasValue && task.Title != dto.Title)
        {
            var existingTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.TaskListId == task.TaskListId.Value 
                    && t.Title == dto.Title 
                    && t.Id != id);

            if (existingTask != null)
            {
                throw new InvalidOperationException($"A task with the name '{dto.Title}' already exists in this task list.");
            }
        }

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Status = dto.Status;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(task);
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == DefaultUserId);

        if (task == null)
            return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateTaskStatusAsync(int id, TaskItemStatus status)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == DefaultUserId);

        if (task == null)
            return false;

        task.Status = status;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<TaskItemCountsDto> GetTaskCountsAsync(int? taskListId = null)
    {
        var query = _context.Tasks
            .Where(t => t.UserId == DefaultUserId);

        if (taskListId.HasValue)
        {
            query = query.Where(t => t.TaskListId == taskListId.Value);
        }

        var tasks = await query.ToListAsync();

        return new TaskItemCountsDto
        {
            Pending = tasks.Count(t => t.Status == TaskItemStatus.Pending),
            InProgress = tasks.Count(t => t.Status == TaskItemStatus.InProgress),
            Completed = tasks.Count(t => t.Status == TaskItemStatus.Completed)
        };
    }

    private static TaskItemDto MapToDto(TaskItem task)
    {
        return new TaskItemDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status.ToString(),
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            TaskListId = task.TaskListId
        };
    }
}
