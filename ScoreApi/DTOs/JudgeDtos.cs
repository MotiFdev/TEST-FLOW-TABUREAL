using System.ComponentModel.DataAnnotations;

namespace ScoreApi.DTOs
{
    public class CreateJudgeDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string AssignedRound { get; set; } = string.Empty;
    }

    public class UpdateJudgeDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string AssignedRound { get; set; } = string.Empty;
    }
}