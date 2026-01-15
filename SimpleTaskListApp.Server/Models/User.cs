using System.ComponentModel.DataAnnotations;
using SimpleTaskListApp.Server.Models;

namespace SimpleTaskListApp.Server.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ProfileImagePath { get; set; }

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
