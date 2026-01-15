using System.ComponentModel.DataAnnotations;

namespace SimpleTaskListApp.Server.Models.DTOs;

public class UpdateTaskListDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
}
