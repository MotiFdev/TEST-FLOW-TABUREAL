using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScoreApi.Models
{
    [Table("SubmissionScores")]
    public class SubmissionScore
    {
        [Key]
        public int SubmissionScoreId { get; set; }

        public int SubmissionId { get; set; }
        public int CriterionId { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        public decimal ScoreValue { get; set; }

        // Navigation
        public ScoreSubmission? Submission { get; set; }
        public Criterion? Criterion { get; set; }
    }
}