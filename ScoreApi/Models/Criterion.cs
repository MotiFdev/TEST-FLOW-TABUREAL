using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScoreApi.Models
{
    [Table("Criteria")]
    public class Criterion
    {
        [Key]
        public int CriterionId { get; set; }

        [Required]
        public int RoundId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "decimal(5, 2)")]
        public decimal MaxScore { get; set; } = 100.00m;

        [Column(TypeName = "decimal(5, 2)")]
        public decimal WeightPercentage { get; set; }

        // Navigation
        public Round? Round { get; set; }
        public ICollection<SubmissionScore> SubmissionScores { get; set; } = new List<SubmissionScore>();
    }
}