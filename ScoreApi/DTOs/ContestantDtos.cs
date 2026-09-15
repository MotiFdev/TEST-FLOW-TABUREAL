using System.ComponentModel.DataAnnotations;

namespace ScoreApi.DTOs
{
    public class CreateContestantDto
    {
        [Required]
        public int ContestantNumber { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Status { get; set; } = "Active";
    }

    public class UpdateContestantStatusDto
    {
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Active";
    }
}