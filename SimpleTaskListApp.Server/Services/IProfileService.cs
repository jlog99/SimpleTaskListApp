namespace SimpleTaskListApp.Server.Services;

public interface IProfileService
{
    Task<string?> UploadProfileImageAsync(IFormFile file);
    Task<string?> GetProfileImagePathAsync();
    Task<bool> DeleteProfileImageAsync();
}
