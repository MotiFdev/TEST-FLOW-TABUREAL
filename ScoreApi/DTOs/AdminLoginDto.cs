using System.ComponentModel.DataAnnotations;

namespace ScoreApi.DTOs
{
    public class AdminLoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class JudgeLoginDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "A judge must be selected.")]
        public int JudgeNumber { get; set; }

        [Required]
        [MaxLength(10)]
        public string PinCode { get; set; } = string.Empty;
    }
}