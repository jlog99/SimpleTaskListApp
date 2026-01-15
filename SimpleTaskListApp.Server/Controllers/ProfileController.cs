using Microsoft.AspNetCore.Mvc;
using SimpleTaskListApp.Server.Models.DTOs;
using SimpleTaskListApp.Server.Services;

namespace SimpleTaskListApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController(IProfileService profileService) : ControllerBase
{
    private readonly IProfileService _profileService = profileService;

    [HttpPost("image")]
    public async Task<ActionResult<ProfileImageResponseDto>> UploadProfileImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        try
        {
            var imagePath = await _profileService.UploadProfileImageAsync(file);
            if (string.IsNullOrEmpty(imagePath))
                return BadRequest("Failed to upload image");

            return Ok(new ProfileImageResponseDto { ImagePath = imagePath });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while uploading the image");
        }
    }

    [HttpGet("image")]
    public async Task<ActionResult<ProfileImageResponseDto>> GetProfileImage()
    {
        var imagePath = await _profileService.GetProfileImagePathAsync();
        if (string.IsNullOrEmpty(imagePath))
            return NotFound();

        return Ok(new ProfileImageResponseDto { ImagePath = imagePath });
    }

    [HttpDelete("image")]
    public async Task<IActionResult> DeleteProfileImage()
    {
        var result = await _profileService.DeleteProfileImageAsync();
        if (!result)
            return NotFound();

        return NoContent();
    }
}
