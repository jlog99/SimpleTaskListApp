using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleTaskListApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskListSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create TaskLists table if it doesn't exist
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS ""TaskLists"" (
                    ""Id"" INTEGER NOT NULL CONSTRAINT ""PK_TaskLists"" PRIMARY KEY AUTOINCREMENT,
                    ""Name"" TEXT NOT NULL,
                    ""UserId"" INTEGER NOT NULL,
                    ""CreatedAt"" TEXT NOT NULL,
                    ""UpdatedAt"" TEXT NOT NULL,
                    CONSTRAINT ""FK_TaskLists_Users_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""Users"" (""Id"") ON DELETE CASCADE
                );
            ");

            // Add TaskListId column to Tasks table
            // Note: If column already exists, this migration will need to be adjusted
            // For existing databases, you may need to manually verify the column doesn't exist first
            migrationBuilder.AddColumn<int>(
                name: "TaskListId",
                table: "Tasks",
                type: "INTEGER",
                nullable: true);

            // Create indexes if they don't exist
            migrationBuilder.Sql(@"
                CREATE UNIQUE INDEX IF NOT EXISTS ""IX_TaskLists_UserId_Name"" 
                ON ""TaskLists"" (""UserId"", ""Name"");
            ");

            migrationBuilder.Sql(@"
                CREATE UNIQUE INDEX IF NOT EXISTS ""IX_Tasks_TaskListId_Title"" 
                ON ""Tasks"" (""TaskListId"", ""Title"") 
                WHERE ""TaskListId"" IS NOT NULL;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "TaskLists");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
