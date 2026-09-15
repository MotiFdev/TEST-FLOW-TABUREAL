using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScoreApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveWeightFromRounds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WeightPercentage",
                table: "Rounds");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "WeightPercentage",
                table: "Rounds",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
