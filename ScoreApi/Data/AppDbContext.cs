using Microsoft.EntityFrameworkCore;
using ScoreApi.Models;

namespace ScoreApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Round> Rounds { get; set; }
        public DbSet<Criterion> Criteria { get; set; }
        public DbSet<Contestant> Contestants { get; set; }
        public DbSet<Judge> Judges { get; set; }
        public DbSet<ScoreSubmission> ScoreSubmissions { get; set; }
        public DbSet<SubmissionScore> SubmissionScores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Admin Unique Username Index
            modelBuilder.Entity<Admin>()
                .HasIndex(a => a.Username)
                .IsUnique();

            // Unique Index on SubmissionUuid for single-write idempotency
            modelBuilder.Entity<ScoreSubmission>()
                .HasIndex(s => s.SubmissionUuid)
                .IsUnique();

            // Round 1 -> N Criteria
            modelBuilder.Entity<Criterion>()
                .HasOne(c => c.Round)
                .WithMany(r => r.Criteria)
                .HasForeignKey(c => c.RoundId)
                .OnDelete(DeleteBehavior.Cascade);

            // Round 1 -> N ScoreSubmissions
            modelBuilder.Entity<ScoreSubmission>()
                .HasOne(s => s.Round)
                .WithMany(r => r.ScoreSubmissions)
                .HasForeignKey(s => s.RoundId)
                .OnDelete(DeleteBehavior.Restrict);

            // Judge 1 -> N ScoreSubmissions
            modelBuilder.Entity<ScoreSubmission>()
                .HasOne(s => s.Judge)
                .WithMany(j => j.ScoreSubmissions)
                .HasForeignKey(s => s.JudgeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Contestant 1 -> N ScoreSubmissions
            modelBuilder.Entity<ScoreSubmission>()
                .HasOne(s => s.Contestant)
                .WithMany(c => c.ScoreSubmissions)
                .HasForeignKey(s => s.ContestantId)
                .OnDelete(DeleteBehavior.Restrict);

            // ScoreSubmission 1 -> N SubmissionScores
            modelBuilder.Entity<SubmissionScore>()
                .HasOne(ss => ss.Submission)
                .WithMany(s => s.SubmissionScores)
                .HasForeignKey(ss => ss.SubmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Criterion 1 -> N SubmissionScores
            modelBuilder.Entity<SubmissionScore>()
                .HasOne(ss => ss.Criterion)
                .WithMany(c => c.SubmissionScores)
                .HasForeignKey(ss => ss.CriterionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}