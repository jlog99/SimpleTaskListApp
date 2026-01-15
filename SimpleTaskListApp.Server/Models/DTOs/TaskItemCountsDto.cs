namespace SimpleTaskListApp.Server.Models.DTOs;

public class TaskItemCountsDto
{
    public int Pending { get; set; }
    public int InProgress { get; set; }
    public int Completed { get; set; }
}
