using Microsoft.EntityFrameworkCore;
using SimpleTaskListApp.Server.Models;

namespace SimpleTaskListApp.Server.Data;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        const int DefaultUserId = 1;

        // Check if users already exist
        if (!context.Users.Any())
        {
            // Create default user for single-user mode
            var defaultUser = new User
            {
                Name = "Ali",
                ProfileImagePath = null
            };

            context.Users.Add(defaultUser);
            context.SaveChanges();
        }

        // Find or create default "My Tasks" task list
        var existingTasks = context.TaskLists.Any();

        if (!existingTasks)
        {
            var defaultTaskList = new TaskItemList
            {
                Name = "My Tasks",
                UserId = DefaultUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.TaskLists.Add(defaultTaskList);
            context.SaveChanges();
        }

        context.SaveChanges();

        // Ensure at least one task list exists for the default user
        if (!context.TaskLists.Any(tl => tl.UserId == DefaultUserId))
        {
            var taskList = new TaskItemList
            {
                Name = "My Tasks",
                UserId = DefaultUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.TaskLists.Add(taskList);
            context.SaveChanges();
        }
    }
}
