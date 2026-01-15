using Microsoft.AspNetCore.Mvc;
using SimpleTaskListApp.Server.Models.DTOs;
using SimpleTaskListApp.Server.Services;

namespace SimpleTaskListApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskListsController(ITaskListService taskListService) : ControllerBase
{
    private readonly ITaskListService _taskListService = taskListService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItemListDto>>> GetTaskLists()
    {
        var taskLists = await _taskListService.GetAllTaskListsAsync();
        return Ok(taskLists);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItemListDto>> GetTaskList(int id)
    {
        var taskList = await _taskListService.GetTaskListByIdAsync(id);
        if (taskList == null)
            return NotFound();

        return Ok(taskList);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItemListDto>> CreateTaskList([FromBody] CreateTaskListDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var taskList = await _taskListService.CreateTaskListAsync(dto);
            return CreatedAtAction(nameof(GetTaskList), new { id = taskList.Id }, taskList);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskItemListDto>> UpdateTaskList(int id, [FromBody] UpdateTaskListDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var taskList = await _taskListService.UpdateTaskListAsync(id, dto);
            if (taskList == null)
                return NotFound();

            return Ok(taskList);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTaskList(int id)
    {
        var result = await _taskListService.DeleteTaskListAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
