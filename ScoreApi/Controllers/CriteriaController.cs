using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScoreApi.Data;
using ScoreApi.DTOs;
using ScoreApi.Models;

namespace ScoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CriteriaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CriteriaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/criteria
        // Display: all criteria, ordered per round then by creation, with round name resolved
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var criteria = await _context.Criteria
                .Include(c => c.Round)
                .OrderBy(c => c.CriterionId)
                .Select(c => new
                {
                    c.CriterionId,
                    c.RoundId,
                    RoundName = c.Round != null ? c.Round.Name : string.Empty,
                    c.Name,
                    c.MaxScore,
                    c.WeightPercentage
                })
                .ToListAsync();

            return Ok(criteria);
        }

        // GET: api/criteria/{id}
        // Display: single criterion
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var criterion = await _context.Criteria
                .Include(c => c.Round)
                .Where(c => c.CriterionId == id)
                .Select(c => new
                {
                    c.CriterionId,
                    c.RoundId,
                    RoundName = c.Round != null ? c.Round.Name : string.Empty,
                    c.Name,
                    c.MaxScore,
                    c.WeightPercentage
                })
                .FirstOrDefaultAsync();

            if (criterion == null)
            {
                return NotFound(new { message = "Criterion not found." });
            }

            return Ok(criterion);
        }

        // GET: api/criteria/round/{roundId}
        // Display: criteria belonging to one round (judge scoring panel + weight totals)
        [HttpGet("round/{roundId}")]
        public async Task<IActionResult> GetByRound(int roundId)
        {
            var criteria = await _context.Criteria
                .Where(c => c.RoundId == roundId)
                .OrderBy(c => c.CriterionId)
                .ToListAsync();

            return Ok(criteria);
        }

        // POST: api/criteria
        // Add: rejects unknown rounds and weight overflows past 100% for the target round
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCriterionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var roundExists = await _context.Rounds.AnyAsync(r => r.RoundId == dto.RoundId);
            if (!roundExists)
            {
                return BadRequest(new { message = "Associated competition round does not exist." });
            }

            var existingWeight = await _context.Criteria
                .Where(c => c.RoundId == dto.RoundId)
                .SumAsync(c => (decimal?)c.WeightPercentage) ?? 0m;

            if (existingWeight + dto.WeightPercentage > 100m)
            {
                return BadRequest(new
                {
                    message = $"Cannot add criterion: round weights would total {existingWeight + dto.WeightPercentage}%. Maximum is 100%."
                });
            }

            var criterion = new Criterion
            {
                RoundId = dto.RoundId,
                Name = dto.Name,
                MaxScore = dto.MaxScore,
                WeightPercentage = dto.WeightPercentage
            };

            _context.Criteria.Add(criterion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = criterion.CriterionId }, criterion);
        }

        // PUT: api/criteria/{id}
        // Edit: name / max score / weight; weight cap enforced excluding this criterion's own weight
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCriterionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var criterion = await _context.Criteria.FindAsync(id);
            if (criterion == null)
            {
                return NotFound(new { message = "Criterion not found." });
            }

            var otherWeights = await _context.Criteria
                .Where(c => c.RoundId == criterion.RoundId && c.CriterionId != id)
                .SumAsync(c => (decimal?)c.WeightPercentage) ?? 0m;

            if (otherWeights + dto.WeightPercentage > 100m)
            {
                return BadRequest(new
                {
                    message = $"Cannot update criterion: round weights would total {otherWeights + dto.WeightPercentage}%. Maximum is 100%."
                });
            }

            criterion.Name = dto.Name;
            criterion.MaxScore = dto.MaxScore;
            criterion.WeightPercentage = dto.WeightPercentage;

            await _context.SaveChangesAsync();
            return Ok(criterion);
        }

        // DELETE: api/criteria/{id}
        // Delete: blocked with a clear message when submitted scores already reference this criterion
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var criterion = await _context.Criteria.FindAsync(id);
            if (criterion == null)
            {
                return NotFound(new { message = "Criterion not found." });
            }

            var hasSubmissions = await _context.SubmissionScores
                .AnyAsync(ss => ss.CriterionId == id);

            if (hasSubmissions)
            {
                return Conflict(new
                {
                    message = "Cannot delete criterion: submitted scores depend on it. Deactivate the round instead of deleting scored criteria."
                });
            }

            _context.Criteria.Remove(criterion);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Criterion deleted successfully." });
        }
    }
}