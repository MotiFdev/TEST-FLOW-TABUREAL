using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreApi.Data;
using ScoreApi.DTOs;
using ScoreApi.Models;
using BCrypt.Net;

namespace ScoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] AdminLoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingAdmin = await _context.Admins
                .AnyAsync(a => a.Username == dto.Username);

            if (existingAdmin)
            {
                return BadRequest(new { message = "Username already exists." });
            }

            // Securely hash the plain-text password before persisting
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var admin = new Admin
            {
                Username = dto.Username,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Admin account created successfully",
                adminId = admin.AdminId,
                username = admin.Username
            });
        }

        [HttpPost("admin-login")]
        public async Task<IActionResult> AdminLogin([FromBody] AdminLoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Username == dto.Username);

            // Verify the incoming password against stored hash
            if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(new
            {
                message = "Login successful",
                adminId = admin.AdminId,
                username = admin.Username
            });
        }

        [HttpPost("judge-login")]
        public async Task<IActionResult> JudgeLogin([FromBody] JudgeLoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var judge = await _context.Judges
                .FirstOrDefaultAsync(j => j.JudgeNumber == dto.JudgeNumber);

            // Judge number + PIN must match the same judge account
            if (judge == null || judge.PinCode != dto.PinCode)
            {
                return Unauthorized(new { message = "Invalid judge number or PIN." });
            }

            return Ok(new
            {
                judgeId = judge.JudgeId,
                judgeNumber = judge.JudgeNumber,
                fullName = judge.FullName,
                assignedRound = judge.AssignedRound
            });
        }
    }
}
