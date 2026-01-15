using Microsoft.EntityFrameworkCore;
using SimpleTaskListApp.Server.Models;

namespace SimpleTaskListApp.Server.Data;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        context.Database.EnsureCreated();

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

        // Migrate existing tasks to a default task list if they don't have a task list
        var orphanedTasks = context.Tasks
            .Where(t => t.UserId == DefaultUserId && t.TaskListId == null)
            .ToList();

        if (orphanedTasks.Any())
        {
            // Find or create default "My Tasks" task list
            var defaultTaskList = context.TaskLists
                .FirstOrDefault(tl => tl.UserId == DefaultUserId && tl.Name == "My Tasks");

            if (defaultTaskList == null)
            {
                defaultTaskList = new TaskItemList
                {
                    Name = "My Tasks",
                    UserId = DefaultUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                context.TaskLists.Add(defaultTaskList);
                context.SaveChanges();
            }

            // Assign orphaned tasks to the default task list
            foreach (var task in orphanedTasks)
            {
                task.TaskListId = defaultTaskList.Id;
            }

            context.SaveChanges();
        }

        // Ensure at least one task list exists for the default user
        if (!context.TaskLists.Any(tl => tl.UserId == DefaultUserId))
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
    }
}
