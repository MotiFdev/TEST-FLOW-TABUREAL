using System.ComponentModel.DataAnnotations;

namespace ScoreApi.DTOs
{
    public class CreateCriterionDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "A target round must be selected.")]
        public int RoundId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, 999.99, ErrorMessage = "Max score must be between 0.01 and 999.99.")]
        public decimal MaxScore { get; set; } = 100.00m;

        [Range(0, 100, ErrorMessage = "Weight must be between 0 and 100.")]
        public decimal WeightPercentage { get; set; }
    }

    public class UpdateCriterionDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, 999.99, ErrorMessage = "Max score must be between 0.01 and 999.99.")]
        public decimal MaxScore { get; set; } = 100.00m;

        [Range(0, 100, ErrorMessage = "Weight must be between 0 and 100.")]
        public decimal WeightPercentage { get; set; }
    }
}