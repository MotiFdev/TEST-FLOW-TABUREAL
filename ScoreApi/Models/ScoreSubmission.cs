using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScoreApi.Models
{
    [Table("ScoreSubmissions")]
    public class ScoreSubmission
    {
        [Key]
        public int SubmissionId { get; set; }

        [Required]
        [MaxLength(50)]
        public string SubmissionUuid { get; set; } = string.Empty; // UUID generated in IndexedDB

        public int JudgeId { get; set; }
        public int ContestantId { get; set; }
        public int RoundId { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal TotalScore { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Judge? Judge { get; set; }
        public Contestant? Contestant { get; set; }
        public Round? Round { get; set; }
        public ICollection<SubmissionScore> SubmissionScores { get; set; } = new List<SubmissionScore>();
    }
}