using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScoreApi.Models
{
    [Table("Rounds")]
    public class Round
    {
        [Key]
        public int RoundId { get; set; }

        public int Sequence { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public bool IsActive { get; set; } = false;

        // Navigation
        public ICollection<Criterion> Criteria { get; set; } = new List<Criterion>();
        public ICollection<ScoreSubmission> ScoreSubmissions { get; set; } = new List<ScoreSubmission>();
    }
}