using System.ComponentModel.DataAnnotations;

namespace SimpleTaskListApp.Server.Models.DTOs;

public class CreateTaskItemDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;

    [Required]
    public int TaskListId { get; set; }
}
