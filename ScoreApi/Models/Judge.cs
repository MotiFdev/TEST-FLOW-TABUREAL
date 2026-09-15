using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScoreApi.Models
{
    [Table("Judges")]
    public class Judge
    {
        [Key]
        public int JudgeId { get; set; }

        public int JudgeNumber { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string PinCode { get; set; } = string.Empty;

        [MaxLength(100)]
        public string AssignedRound { get; set; } = string.Empty;

        // Navigation
        public ICollection<ScoreSubmission> ScoreSubmissions { get; set; } = new List<ScoreSubmission>();
    }
}