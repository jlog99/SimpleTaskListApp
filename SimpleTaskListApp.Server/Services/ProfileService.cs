using Microsoft.EntityFrameworkCore;
using SimpleTaskListApp.Server.Data;

namespace SimpleTaskListApp.Server.Services;

public class ProfileService : IProfileService
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private const int DefaultUserId = 1; // Single-user mode
    private const string UploadsFolder = "uploads/profile";
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

    public ProfileService(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    public async Task<string?> UploadProfileImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return null;

        // Validate file size
        if (file.Length > MaxFileSize)
            throw new InvalidOperationException($"File size exceeds the maximum allowed size of {MaxFileSize / (1024 * 1024)}MB");

        // Validate file extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException($"File type not allowed. Allowed types: {string.Join(", ", AllowedExtensions)}");

        // Get user
        var user = await _context.Users.FindAsync(DefaultUserId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        // Delete old image if exists
        if (!string.IsNullOrEmpty(user.ProfileImagePath))
        {
            var oldImagePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, user.ProfileImagePath);
            if (File.Exists(oldImagePath))
            {
                File.Delete(oldImagePath);
            }
        }

        // Create uploads directory if it doesn't exist
        var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, UploadsFolder);
        Directory.CreateDirectory(uploadsPath);

        // Generate unique filename
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);
        var relativePath = Path.Combine(UploadsFolder, fileName).Replace('\\', '/');

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update user profile image path
        user.ProfileImagePath = relativePath;
        await _context.SaveChangesAsync();

        return relativePath;
    }

    public async Task<string?> GetProfileImagePathAsync()
    {
        var user = await _context.Users.FindAsync(DefaultUserId);
        return user?.ProfileImagePath;
    }

    public async Task<bool> DeleteProfileImageAsync()
    {
        var user = await _context.Users.FindAsync(DefaultUserId);
        if (user == null || string.IsNullOrEmpty(user.ProfileImagePath))
            return false;

        var imagePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, user.ProfileImagePath);
        if (File.Exists(imagePath))
        {
            File.Delete(imagePath);
        }

        user.ProfileImagePath = null;
        await _context.SaveChangesAsync();

        return true;
    }
}
