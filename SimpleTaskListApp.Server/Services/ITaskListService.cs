using SimpleTaskListApp.Server.Models.DTOs;

namespace SimpleTaskListApp.Server.Services;

public interface ITaskListService
{
    Task<IEnumerable<TaskItemListDto>> GetAllTaskListsAsync();
    Task<TaskItemListDto?> GetTaskListByIdAsync(int id);
    Task<TaskItemListDto> CreateTaskListAsync(CreateTaskListDto dto);
    Task<TaskItemListDto?> UpdateTaskListAsync(int id, UpdateTaskListDto dto);
    Task<bool> DeleteTaskListAsync(int id);
}
