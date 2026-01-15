using Microsoft.EntityFrameworkCore;
using SimpleTaskListApp.Server.Models;

namespace SimpleTaskListApp.Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<TaskItemList> TaskLists { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Tasks)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.TaskList)
                  .WithMany(tl => tl.Tasks)
                  .HasForeignKey(e => e.TaskListId)
                  .OnDelete(DeleteBehavior.Cascade);
            
            // Unique constraint: Title must be unique within a TaskList
            entity.HasIndex(e => new { e.TaskListId, e.Title })
                  .IsUnique()
                  .HasFilter("[TaskListId] IS NOT NULL");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ProfileImagePath).HasMaxLength(500);
        });

        modelBuilder.Entity<TaskItemList>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            
            // Unique constraint: Name must be unique per User
            entity.HasIndex(e => new { e.UserId, e.Name })
                  .IsUnique();
        });
    }
}
