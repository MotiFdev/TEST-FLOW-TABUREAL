using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreApi.Data;
using ScoreApi.DTOs;
using ScoreApi.Models;

namespace ScoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoundsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoundsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/rounds
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rounds = await _context.Rounds
                .OrderBy(r => r.Sequence)
                .ToListAsync();

            return Ok(rounds);
        }

        // POST: api/rounds
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRoundDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int nextSequence = dto.Sequence > 0 
                ? dto.Sequence 
                : (await _context.Rounds.MaxAsync(r => (int?)r.Sequence) ?? 0) + 1;

            var round = new Round
            {
                Sequence = nextSequence,
                Name = dto.Name,
                IsActive = false
            };

            _context.Rounds.Add(round);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = round.RoundId }, round);
        }

        // PUT: api/rounds/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRoundDto dto)
        {
            var round = await _context.Rounds.FindAsync(id);
            if (round == null)
                return NotFound(new { message = "Round not found." });

            round.Sequence = dto.Sequence;
            round.Name = dto.Name;

            await _context.SaveChangesAsync();
            return Ok(round);
        }

        // PATCH: api/rounds/{id}/set-active
        [HttpPatch("{id}/set-active")]
        public async Task<IActionResult> SetActive(int id)
        {
            var targetRound = await _context.Rounds.FindAsync(id);
            if (targetRound == null)
                return NotFound(new { message = "Round not found." });

            // Deactivate all existing rounds, set target as active
            var allRounds = await _context.Rounds.ToListAsync();
            foreach (var r in allRounds)
            {
                r.IsActive = (r.RoundId == id);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Round '{targetRound.Name}' set as active.", activeRoundId = id });
        }

        // DELETE: api/rounds/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var round = await _context.Rounds.FindAsync(id);
            if (round == null)
                return NotFound(new { message = "Round not found." });

            _context.Rounds.Remove(round);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Round deleted successfully." });
        }
    }
}