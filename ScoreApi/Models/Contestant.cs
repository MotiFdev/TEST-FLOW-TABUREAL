using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScoreApi.Models
{
    [Table("Contestants")]
    public class Contestant
    {
        [Key]
        public int ContestantId { get; set; }

        public int ContestantNumber { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Active";

        // Navigation
        public ICollection<ScoreSubmission> ScoreSubmissions { get; set; } = new List<ScoreSubmission>();
    }
}