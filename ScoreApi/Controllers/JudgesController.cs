using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreApi.Data;
using ScoreApi.DTOs;
using ScoreApi.Models;

namespace ScoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JudgesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JudgesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/judges
        // Display: all judges ordered by judge number
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var judges = await _context.Judges
                .OrderBy(j => j.JudgeNumber)
                .ToListAsync();

            return Ok(judges);
        }

        // GET: api/judges/{id}
        // Display: single judge
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var judge = await _context.Judges.FindAsync(id);
            if (judge == null)
            {
                return NotFound(new { message = "Judge not found." });
            }

            return Ok(judge);
        }

        // POST: api/judges
        // Add: judge number and access PIN are generated server-side;
        // the PIN is the judge's login credential and must be unique.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateJudgeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!string.IsNullOrWhiteSpace(dto.AssignedRound))
            {
                var roundExists = await _context.Rounds
                    .AnyAsync(r => r.Name == dto.AssignedRound);
                if (!roundExists)
                {
                    return BadRequest(new { message = "Assigned round does not exist." });
                }
            }

            var nextJudgeNumber = (await _context.Judges
                .MaxAsync(j => (int?)j.JudgeNumber) ?? 0) + 1;

            var pinCode = await GenerateUniquePinAsync();

            var judge = new Judge
            {
                JudgeNumber = nextJudgeNumber,
                FullName = dto.FullName,
                PinCode = pinCode,
                AssignedRound = dto.AssignedRound ?? string.Empty
            };

            _context.Judges.Add(judge);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = judge.JudgeId }, judge);
        }

        // PUT: api/judges/{id}
        // Edit: name and round assignment; judge number and PIN are not editable here
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateJudgeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var judge = await _context.Judges.FindAsync(id);
            if (judge == null)
            {
                return NotFound(new { message = "Judge not found." });
            }

            if (!string.IsNullOrWhiteSpace(dto.AssignedRound))
            {
                var roundExists = await _context.Rounds
                    .AnyAsync(r => r.Name == dto.AssignedRound);
                if (!roundExists)
                {
                    return BadRequest(new { message = "Assigned round does not exist." });
                }
            }

            judge.FullName = dto.FullName;
            judge.AssignedRound = dto.AssignedRound ?? string.Empty;

            await _context.SaveChangesAsync();
            return Ok(judge);
        }

        // DELETE: api/judges/{id}
        // Delete: blocked with a clear message when the judge already has score submissions
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var judge = await _context.Judges.FindAsync(id);
            if (judge == null)
            {
                return NotFound(new { message = "Judge not found." });
            }

            var hasSubmissions = await _context.ScoreSubmissions
                .AnyAsync(s => s.JudgeId == id);

            if (hasSubmissions)
            {
                return Conflict(new
                {
                    message = "Cannot delete judge: score submissions are recorded under this judge. Remove the judge's submissions first."
                });
            }

            _context.Judges.Remove(judge);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Judge deleted successfully." });
        }

        // Generates a 4-digit PIN (1000-9999) that no other judge currently holds.
        private async Task<string> GenerateUniquePinAsync()
        {
            while (true)
            {
                var candidate = Random.Shared.Next(1000, 10000).ToString();

                var pinTaken = await _context.Judges
                    .AnyAsync(j => j.PinCode == candidate);

                if (!pinTaken)
                {
                    return candidate;
                }
            }
        }
    }
}