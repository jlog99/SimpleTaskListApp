using Microsoft.AspNetCore.Mvc;
using SimpleTaskListApp.Server.Models.DTOs;
using SimpleTaskListApp.Server.Services;

namespace SimpleTaskListApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(ITaskService taskService) : ControllerBase
{
    private readonly ITaskService _taskService = taskService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetTasks([FromQuery] int? taskListId)
    {
        var tasks = await _taskService.GetAllTasksAsync(taskListId);
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItemDto>> GetTask(int id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);
        if (task == null)
            return NotFound();

        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItemDto>> CreateTask([FromBody] CreateTaskItemDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var task = await _taskService.CreateTaskAsync(dto);
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskItemDto>> UpdateTask(int id, [FromBody] UpdateTaskItemDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var task = await _taskService.UpdateTaskAsync(id, dto);
            if (task == null)
                return NotFound();

            return Ok(task);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var result = await _taskService.DeleteTaskAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateTaskItemStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _taskService.UpdateTaskStatusAsync(id, dto.Status);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("counts")]
    public async Task<ActionResult<TaskItemCountsDto>> GetTaskCounts([FromQuery] int? taskListId)
    {
        var counts = await _taskService.GetTaskCountsAsync(taskListId);
        return Ok(counts);
    }
}
