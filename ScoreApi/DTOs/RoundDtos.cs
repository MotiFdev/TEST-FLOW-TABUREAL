using System.ComponentModel.DataAnnotations;

namespace ScoreApi.DTOs
{
    public class CreateRoundDto
    {
        public int Sequence { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateRoundDto
    {
        public int Sequence { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}