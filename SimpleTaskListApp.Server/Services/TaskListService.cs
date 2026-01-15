using Microsoft.EntityFrameworkCore;
using SimpleTaskListApp.Server.Data;
using SimpleTaskListApp.Server.Models;
using SimpleTaskListApp.Server.Models.DTOs;

namespace SimpleTaskListApp.Server.Services;

public class TaskListService : ITaskListService
{
    private readonly ApplicationDbContext _context;
    private const int DefaultUserId = 1; // Single-user mode

    public TaskListService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItemListDto>> GetAllTaskListsAsync()
    {
        var taskLists = await _context.TaskLists
            .Where(tl => tl.UserId == DefaultUserId)
            .OrderBy(tl => tl.Name)
            .ToListAsync();

        return taskLists.Select(MapToDto);
    }

    public async Task<TaskItemListDto?> GetTaskListByIdAsync(int id)
    {
        var taskList = await _context.TaskLists
            .FirstOrDefaultAsync(tl => tl.Id == id && tl.UserId == DefaultUserId);

        return taskList == null ? null : MapToDto(taskList);
    }

    public async Task<TaskItemListDto> CreateTaskListAsync(CreateTaskListDto dto)
    {
        // Check for uniqueness: Name must be unique per User
        var existingTaskList = await _context.TaskLists
            .FirstOrDefaultAsync(tl => tl.UserId == DefaultUserId && tl.Name == dto.Name);

        if (existingTaskList != null)
        {
            throw new InvalidOperationException($"A task list with the name '{dto.Name}' already exists.");
        }

        var taskList = new TaskItemList
        {
            Name = dto.Name,
            UserId = DefaultUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.TaskLists.Add(taskList);
        await _context.SaveChangesAsync();

        return MapToDto(taskList);
    }

    public async Task<TaskItemListDto?> UpdateTaskListAsync(int id, UpdateTaskListDto dto)
    {
        var taskList = await _context.TaskLists
            .FirstOrDefaultAsync(tl => tl.Id == id && tl.UserId == DefaultUserId);

        if (taskList == null)
            return null;

        // Check for uniqueness: Name must be unique per User (excluding current task list)
        var existingTaskList = await _context.TaskLists
            .FirstOrDefaultAsync(tl => tl.UserId == DefaultUserId 
                && tl.Name == dto.Name 
                && tl.Id != id);

        if (existingTaskList != null)
        {
            throw new InvalidOperationException($"A task list with the name '{dto.Name}' already exists.");
        }

        taskList.Name = dto.Name;
        taskList.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(taskList);
    }

    public async Task<bool> DeleteTaskListAsync(int id)
    {
        var taskList = await _context.TaskLists
            .FirstOrDefaultAsync(tl => tl.Id == id && tl.UserId == DefaultUserId);

        if (taskList == null)
            return false;

        // Tasks will be cascade deleted due to the foreign key relationship
        _context.TaskLists.Remove(taskList);
        await _context.SaveChangesAsync();

        return true;
    }

    private static TaskItemListDto MapToDto(TaskItemList taskList)
    {
        return new TaskItemListDto
        {
            Id = taskList.Id,
            Name = taskList.Name,
            CreatedAt = taskList.CreatedAt,
            UpdatedAt = taskList.UpdatedAt
        };
    }
}
