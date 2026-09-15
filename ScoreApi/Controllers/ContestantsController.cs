using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreApi.Data;
using ScoreApi.DTOs;
using ScoreApi.Models;

namespace ScoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContestantsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContestantsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/contestants
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contestants = await _context.Contestants
                .OrderBy(c => c.ContestantNumber)
                .ToListAsync();

            return Ok(contestants);
        }

        // POST: api/contestants
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateContestantDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var contestantExists = await _context.Contestants
                .AnyAsync(c => c.ContestantNumber == dto.ContestantNumber);

            if (contestantExists)
            {
                return BadRequest(new { message = $"Contestant number #{dto.ContestantNumber} is already assigned." });
            }

            var contestant = new Contestant
            {
                ContestantNumber = dto.ContestantNumber,
                FullName = dto.FullName,
                Category = dto.Category,
                Status = dto.Status
            };

            _context.Contestants.Add(contestant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = contestant.ContestantId }, contestant);
        }

        // PATCH: api/contestants/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateContestantStatusDto dto)
        {
            var contestant = await _context.Contestants.FindAsync(id);
            if (contestant == null)
            {
                return NotFound(new { message = "Contestant not found." });
            }

            contestant.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated successfully.", contestantId = id, newStatus = contestant.Status });
        }

        // DELETE: api/contestants/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var contestant = await _context.Contestants.FindAsync(id);
            if (contestant == null)
            {
                return NotFound(new { message = "Contestant not found." });
            }

            _context.Contestants.Remove(contestant);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Contestant deleted successfully." });
        }
    }
}